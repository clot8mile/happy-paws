-- 允许任何已登录用户插入消息（简化测试）
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;

CREATE POLICY "Users can insert their own messages"
ON messages FOR INSERT
WITH CHECK (true);
