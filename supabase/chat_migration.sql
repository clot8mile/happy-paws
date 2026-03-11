-- 快乐爪爪救助站 - 实时聊天数据库迁移
-- 请在 Supabase SQL Editor 中执行

-- 1. 创建聊天详情表 (存储实际消息)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id TEXT NOT NULL, -- 格式：'user1_id:user2_id' 或简单的 pet_id
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 开启消息表的实时更新 (Realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 2. RLS 策略

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 允许用户查看自己发送或接收的消息
CREATE POLICY "Users can view their own messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 允许用户发送消息
CREATE POLICY "Users can insert their own messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- 3. 索引以优化查询速度
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
