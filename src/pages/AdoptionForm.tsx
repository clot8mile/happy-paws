import { motion } from "motion/react";
import { ArrowLeft, Send, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAdoptions } from "../context/AdoptionContext";
import { useNotification } from "../context/NotificationContext";
import { api } from "../lib/api";

export default function AdoptionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addApplication } = useAdoptions();
  const { showToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get<any>(`/pets/${id}`)
        .then(data => setPet(data))
        .catch(err => console.error("Failed to fetch pet for form:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const getFirstImage = (images: any): string => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === 'string') {
      if (images.startsWith('{')) return images.replace(/[\{\}]/g, '').split(',')[0];
      if (images.startsWith('http')) return images;
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const newId = await addApplication({
        petId: id,
        petName: pet.name,
        petInfo: `${pet.breed} / ${pet.age} / ${pet.gender === 'female' ? '女孩' : '男孩'}`,
        image: getFirstImage(pet.images),
        applicantName: formData.get('name') as string,
        applicantPhone: formData.get('phone') as string,
        livingCity: formData.get('city') as string,
        housingType: formData.get('housing') as string,
        hasExperience: formData.get('experience') === 'true',
        adoptionReason: formData.get('reason') as string,
      });
      showToast("申请提交成功！", "success");
      navigate(`/adoption/${newId}`);
    } catch (err) {
      console.error("Submission failed:", err);
      showToast("提交失败，请重试", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  if (!pet) return <div className="flex-1 flex items-center justify-center min-h-screen"><p>未找到宠物信息</p></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col bg-background-light overflow-y-auto pb-10"
    >
      <header className="bg-white px-5 pt-12 pb-4 flex items-center sticky top-0 z-20 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-slate-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 flex-1 text-center pr-6">
          领养申请表
        </h1>
      </header>

      <main className="p-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
            <img
              src={getFirstImage(pet.images)}
              alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                申请领养 {pet.name}
              </h2>
              <p className="text-sm text-gray-500">{pet.breed} · {pet.age}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                个人信息
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    真实姓名
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="请输入您的姓名"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    联系电话
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="请输入您的手机号"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                居住环境
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    居住城市
                  </label>
                  <input
                    required
                    name="city"
                    type="text"
                    placeholder="例如：上海市 静安区"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    住房情况
                  </label>
                  <select name="housing" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                    <option value="自有住房">自有住房</option>
                    <option value="租房（房东允许养宠）">租房（房东允许养宠）</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                养宠经验
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    是否有养宠经验？
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl py-3 cursor-pointer has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all">
                      <input
                        type="radio"
                        name="experience"
                        value="true"
                        className="hidden"
                        defaultChecked
                      />
                      <span className="text-sm font-medium">有经验</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl py-3 cursor-pointer has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all">
                      <input
                        type="radio"
                        name="experience"
                        value="false"
                        className="hidden"
                      />
                      <span className="text-sm font-medium">新手</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    领养理由
                  </label>
                  <textarea
                    required
                    name="reason"
                    rows={4}
                    placeholder={`请简单描述您为什么想领养 ${pet.name}...`}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </section>

            <div className="bg-blue-50 rounded-2xl p-4 flex gap-3 items-start">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                提交申请后，我们的志愿者将在 1-3
                个工作日内完成初步审核并与您联系。请确保您的联系电话畅通。
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  提交申请
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </motion.div>
  );
}
