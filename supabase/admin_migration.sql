-- 快乐爪爪救助站 - 管理员角色与权限迁移
-- 请在 Supabase SQL Editor 中执行

-- 1. 向 users 表中添加 role 字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. 设置一个初始管理员 (您可以替换为您的用户邮箱)
-- 先查询您的用户 ID，然后执行更新
-- UPDATE users SET role = 'admin' WHERE email = '您的邮箱@example.com';

-- 3. 增强 adoptions 表的管理员权限策略
-- 管理员可以更新所有领养申请
CREATE POLICY "Admins can update all applications" 
ON adoption_applications FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. 增强 pets 表的管理员权限策略
-- 管理员可以插入、更新和删除宠物记录
CREATE POLICY "Admins can insert pets" 
ON pets FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update pets" 
ON pets FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete pets" 
ON pets FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);
