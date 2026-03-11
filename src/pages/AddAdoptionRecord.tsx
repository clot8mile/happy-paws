import { motion } from "motion/react";
import { ArrowLeft, Camera, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAdoptions } from "../context/AdoptionContext";
import { uploadPetPhoto } from "../lib/storage";

export default function AddAdoptionRecord() {
  const navigate = useNavigate();
  const { addApplication } = useAdoptions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    petName: "",
    breed: "",
    age: "",
    gender: "女孩",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = "https://picsum.photos/seed/pet/200/200"; // Fallback
      
      if (imageFile) {
        imageUrl = await uploadPetPhoto(formData.petName, imageFile);
      }

      await addApplication({
        petName: formData.petName,
        petInfo: `${formData.breed} / ${formData.age} / ${formData.gender}`,
        image: imageUrl,
      });
      
      navigate(-1);
    } catch (err) {
      console.error("Failed to add record:", err);
      alert("添加记录失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto pb-10"
    >
      <header className="bg-white px-5 pt-12 pb-4 flex items-center sticky top-0 z-20 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-slate-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 flex-1 text-center pr-6">
          手动添加领养记录
        </h1>
      </header>

      <main className="p-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <label className="relative w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-1 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-8 h-8" />
                  <span className="text-[10px]">上传照片</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                宠物昵称
              </label>
              <input
                required
                type="text"
                value={formData.petName}
                onChange={(e) => setFormData({...formData, petName: e.target.value})}
                placeholder="例如：小黑"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                宠物品种
              </label>
              <input
                required
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({...formData, breed: e.target.value})}
                placeholder="例如：拉布拉多"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  年龄
                </label>
                <input
                  required
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="例如：2岁"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  性别
                </label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option>女孩</option>
                  <option>男孩</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-[0.98] mt-4"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  确认添加
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </motion.div>
  );
}
