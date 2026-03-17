import { motion } from "motion/react";
import { ArrowLeft, Send, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAdoptions } from "../context/AdoptionContext";
import { useNotification } from "../context/NotificationContext";
import { api } from "../lib/api";
import InteractiveButton from "../components/InteractiveButton";

export default function AdoptionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addApplication } = useAdoptions();
  const { showToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const phone = formData.get('phone') as string;
      
      // 简单的手机号正校验 (中国大陆 11 位手机号)
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        setErrors(prev => ({ ...prev, phone: "请输入有效的11位手机号" }));
        showToast("手机号格式不正确", "warning");
        setIsSubmitting(false);
        return;
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
      }

      const newId = await addApplication({
        petId: id,
        petName: pet.name,
        petInfo: `${pet.breed} / ${pet.age} / ${pet.gender === 'female' ? '女孩' : '男孩'}`,
        image: getFirstImage(pet.images),
        applicantName: formData.get('name') as string,
        applicantPhone: phone,
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
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto pb-10"
    >
      <header className="bg-card-bg px-5 pt-12 pb-4 flex items-center sticky top-0 z-20 border-b border-border-subtle">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-ink"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-ink flex-1 text-center pr-6">
          领养申请表
        </h1>
      </header>

      <main className="p-5">
        <div className="bg-card-bg rounded-3xl p-6 shadow-sm border border-border-subtle mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-subtle">
            <img
              src={getFirstImage(pet.images)}
              alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-ink">
                申请领养 {pet.name}
              </h2>
              <p className="text-sm text-ink-muted">{pet.breed} · {pet.age}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <h3 className="text-[11px] font-bold text-ink-muted/50 uppercase tracking-widest mb-4 ml-1">
                个人信息
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5 ml-1">
                    真实姓名
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="请输入您的姓名"
                    className="w-full bg-bg-warm border border-border-subtle rounded-2xl px-4 py-3 text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-ink-muted/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5 ml-1">
                    联系电话
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="请输入您的手机号"
                    className={`w-full bg-bg-warm border rounded-2xl px-4 py-3 text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-ink-muted/30 ${errors.phone ? 'border-red-400 bg-red-400/5' : 'border-border-subtle'}`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1 ml-2">{errors.phone}</p>}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold text-ink-muted/50 uppercase tracking-widest mb-4 ml-1">
                居住环境
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5 ml-1">
                    居住城市
                  </label>
                  <input
                    required
                    name="city"
                    type="text"
                    placeholder="例如：上海市 静安区"
                    className="w-full bg-bg-warm border border-border-subtle rounded-2xl px-4 py-3 text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-ink-muted/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5 ml-1">
                    住房情况
                  </label>
                  <select name="housing" className="w-full bg-bg-warm border border-border-subtle rounded-2xl px-4 py-3 text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                    <option value="自有住房">自有住房</option>
                    <option value="租房（房东允许养宠）">租房（房东允许养宠）</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold text-ink-muted/50 uppercase tracking-widest mb-4 ml-1">
                养宠经验
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5 ml-1">
                    是否有养宠经验？
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-bg-warm border border-border-subtle rounded-2xl py-3 cursor-pointer has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all">
                      <input
                        type="radio"
                        name="experience"
                        value="true"
                        className="hidden"
                        defaultChecked
                      />
                      <span className="text-sm font-medium">有经验</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 bg-bg-warm border border-border-subtle rounded-2xl py-3 cursor-pointer has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all">
                      <input
                        type="radio"
                        name="experience"
                        value="false"
                        className="hidden"
                      />
                      <span className="text-sm font-bold text-ink">新手</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5 ml-1">
                    领养理由
                  </label>
                  <textarea
                    required
                    name="reason"
                    rows={4}
                    placeholder={`请简单描述您为什么想领养 ${pet.name}...`}
                    className="w-full bg-bg-warm border border-border-subtle rounded-2xl px-4 py-3 text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-ink-muted/30"
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

            <InteractiveButton
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  提交申请
                </>
              )}
            </InteractiveButton>
          </form>
        </div>
      </main>
    </motion.div>
  );
}
