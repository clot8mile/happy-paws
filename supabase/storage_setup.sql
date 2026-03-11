-- 快乐爪爪救助站 - Supabase Storage 配置
-- 在 Supabase 控制台的 SQL Editor 中执行以下内容来初始化存储桶和权限

-- 1. 创建两个存储桶：avatars (头像) 和 pets (宠物照片)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true), ('pets', 'pets', true)
ON CONFLICT (id) DO NOTHING;

-- 清理旧策略（如果存在）以防名称冲突
DROP POLICY IF EXISTS "Avatars Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Pets Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage pet photos" ON storage.objects;

-- 2. 设置 avatars 存储桶的 RLS (行级安全策略)

-- 允许任何人查看头像
CREATE POLICY "Avatars Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- 允许登录用户上传自己的头像
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- 允许用户更新/删除自己的文件
CREATE POLICY "Users can update their own avatars" ON storage.objects 
FOR ALL USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. 设置 pets 存储桶的 RLS

-- 允许任何人查看宠物照片
CREATE POLICY "Pets Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'pets');

-- 允许登录用户上传宠物照片
CREATE POLICY "Authenticated users can upload pet photos" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'pets' AND 
  auth.role() = 'authenticated'
);

-- 允许用户管理上传的照片
CREATE POLICY "Authenticated users can manage pet photos" ON storage.objects 
FOR ALL USING (bucket_id = 'pets' AND auth.role() = 'authenticated');
综合以上，您可以在 SQL Editor 中执行此更新版本。

