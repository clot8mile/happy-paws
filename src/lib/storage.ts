import { supabase } from './supabase';

/**
 * 快乐爪爪救助站 - 存储操作工具类
 */

// 桶名称定义
const BUCKETS = {
  AVATARS: 'avatars',
  PETS: 'pets',
};

/**
 * 上传文件到 Supabase Storage
 * @param bucket 存储桶名称 ('avatars' | 'pets')
 * @param file 原始文件对象
 * @param path 存储路径 (例如：userId/filename.jpg)
 * @returns 公开访问 URL
 */
export async function uploadFile(
  bucket: 'avatars' | 'pets',
  file: File,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`文件上传失败: ${error.message}`);
  }

  // 获取公开 URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * 上传头像快捷方法
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
  return uploadFile('avatars', file, fileName);
}

/**
 * 上传宠物照片快捷方法
 */
export async function uploadPetPhoto(petName: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${petName.replace(/\s+/g, '-')}-${timestamp}.${fileExt}`;
  return uploadFile('pets', file, fileName);
}
