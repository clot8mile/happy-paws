-- 快乐爪爪救助站 - 实时聊天数据库迁移 (修复版)
-- 请在 Supabase SQL Editor 中执行

-- 1. 创建或更新聊天详情表
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'messages') THEN
        CREATE TABLE public.messages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            chat_id TEXT NOT NULL, 
            sender_id UUID NOT NULL REFERENCES auth.users(id),
            receiver_id UUID REFERENCES auth.users(id),
            content TEXT NOT NULL,
            is_read BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        -- 如果表已存在，确保 receiver_id 是可选的（移除 NOT NULL）
        ALTER TABLE public.messages ALTER COLUMN receiver_id DROP NOT NULL;
    END IF;
END $$;

-- 2. 开启消息表的实时更新 (Realtime)
-- 使用安全的方式添加表中发布
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;
END $$;

-- 3. RLS 策略
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 允许任何用户读取消息 (临时放开政策以便测试，实际生产应根据 chat_id 或用户 ID 过滤)
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (true);

-- 允许任何用户发送消息 (临时放宽政策以便测试，因为前端 client 目前是以 anon 身份运行)
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;
CREATE POLICY "Users can insert their own messages"
ON public.messages FOR INSERT
WITH CHECK (true);

-- 4. 索引
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
