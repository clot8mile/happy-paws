-- 快乐爪爪救助站 - 用户聊天状态表
-- 用于跟踪每个用户在不同会话中的最后一条消息、未读数等

CREATE TABLE IF NOT EXISTS public.user_chat_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    conversation_id TEXT NOT NULL,
    unread INTEGER DEFAULT 0,
    last_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, conversation_id)
);

-- 开启 RLS
ALTER TABLE public.user_chat_states ENABLE ROW LEVEL SECURITY;

-- 只有用户自己可以查看和修改自己的聊天状态
CREATE POLICY "Users can manage their own chat states"
ON public.user_chat_states
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 索引提高查询效率
CREATE INDEX IF NOT EXISTS idx_user_chat_states_user_id ON public.user_chat_states(user_id);
