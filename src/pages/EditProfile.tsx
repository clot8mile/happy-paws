import { motion } from "motion/react";
import { ChevronLeft, Camera, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import { uploadAvatar } from "../lib/storage";

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, authUser, updateProfile } = useUser();
  const { showToast } = useNotification();
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && authUser) {
      try {
        setIsUploading(true);
        const publicUrl = await uploadAvatar(authUser.id, file);
        setAvatar(publicUrl);
        showToast("头像上传成功");
      } catch (err) {
        console.error("Failed to upload avatar:", err);
        showToast("头像上传失败，请稍后重试", "error");
      } finally {
        setIsUploading(false);
      }
    } else if (!authUser) {
      showToast("请先登录", "warning");
    }
  };

  const handleSave = () => {
    if (isUploading) return;
    updateProfile({
      name,
      bio,
      location,
      avatar,
    });
    showToast("个人资料已更新");
    navigate("/profile");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-bg-main min-h-screen"
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-6 flex items-center justify-between bg-card-bg border-b border-border-subtle">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-border-subtle flex items-center justify-center text-ink active:scale-90 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-ink">编辑资料</h1>
        <button
          onClick={handleSave}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 active:scale-90 transition-all font-bold"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-card-bg shadow-xl overflow-hidden bg-border-subtle">
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary border-4 border-card-bg flex items-center justify-center text-white shadow-lg active:scale-90 transition-all cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p className="mt-4 text-sm text-ink-muted/40 font-medium">点击更换头像</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink ml-1">昵称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-card-bg border border-border-subtle shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-ink placeholder:text-ink-muted/30"
              placeholder="请输入昵称"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-ink ml-1">个人简介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-5 py-4 rounded-2xl bg-card-bg border border-border-subtle shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-ink resize-none placeholder:text-ink-muted/30"
              placeholder="介绍一下你自己吧..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-ink ml-1">所在地</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-card-bg border border-border-subtle shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-ink placeholder:text-ink-muted/30"
              placeholder="请输入所在地"
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-ink ml-1">我的标签</label>
            <button className="text-xs text-primary font-bold">管理标签</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.tags.map((tag, index) => (
              <span key={index} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                {tag}
              </span>
            ))}
            <button className="px-4 py-2 rounded-xl bg-border-subtle text-ink-muted/40 text-xs font-bold border border-dashed border-primary/20">
              + 添加标签
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
