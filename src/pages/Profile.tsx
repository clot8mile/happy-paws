import { motion } from "motion/react";
import {
  Settings,
  UserPen,
  Plus,
  Stethoscope,
  HeartHandshake,
  Medal,
  HelpCircle,
  PawPrint,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const navigate = useNavigate();
  const { profile } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto pb-24"
    >
      <div className="bg-gradient-to-b from-bg-warm to-bg-main pt-12 pb-8 px-5 rounded-b-[40px] shadow-sm relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

        <div className="flex justify-between items-center mb-8 relative z-10">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center backdrop-blur-sm shadow-sm text-ink active:scale-90 transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold tracking-wider text-ink">
            个人中心
          </h1>
          <button
            onClick={() => navigate("/profile/edit")}
            className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center backdrop-blur-sm shadow-sm text-ink active:scale-90 transition-all"
          >
            <UserPen className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center relative z-10">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center bg-white">
              <img
                src={profile.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-ink">{profile.name}</h2>
          <p className="text-sm text-ink-muted mb-4 font-medium">
            {profile.bio}
          </p>
          <div className="flex space-x-3">
            {profile.tags.map((tag, index) => (
              <span key={index} className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>

          {profile.role === 'admin' && (
            <button
              onClick={() => navigate("/admin")}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-[#07C160]/10 text-[#07C160] rounded-full font-bold shadow-sm border border-[#07C160]/20 active:scale-95 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              进入管理后台
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-ink">我的主子</h3>
            <button
              onClick={() => navigate("/my-pets")}
              className="text-sm text-primary font-bold hover:underline"
            >
              查看全部
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 pt-1 -mx-5 px-5">
            <button
              onClick={() => navigate("/my-pets")}
              className="flex-shrink-0 w-36 group flex flex-col items-center"
            >
              <div className="w-36 h-48 rounded-[28px] bg-gray-200 shadow-none flex flex-col items-center justify-center mb-3 transition-transform group-active:scale-95 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 rounded-full blur-xl -ml-8 -mb-8"></div>
                
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-3 z-10">
                  <PawPrint className="w-7 h-7" />
                </div>
                <span className="text-base font-bold text-ink z-10">我的宠物</span>
                <span className="text-[10px] text-ink-muted/60 mt-1 z-10 font-medium">已领养/关注</span>
              </div>
            </button>

            <button
              onClick={() => navigate("/pet/1")}
              className="flex-shrink-0 w-36 group text-left"
            >
              <div className="w-36 h-48 rounded-[28px] overflow-hidden mb-3 shadow-md border border-gray-100 transition-transform group-active:scale-95">
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2462&auto=format&fit=crop"
                  alt="大黄"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-base mb-1 text-ink">大黄</h4>
              <p className="text-xs text-ink-muted">金毛寻回犬</p>
            </button>
            <button
              onClick={() => navigate("/pet/2")}
              className="flex-shrink-0 w-36 group text-left"
            >
              <div className="w-36 h-48 rounded-[28px] overflow-hidden mb-3 shadow-md border border-gray-100 transition-transform group-active:scale-95">
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2643&auto=format&fit=crop"
                  alt="咪咪"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-base mb-1 text-ink">咪咪</h4>
              <p className="text-xs text-ink-muted">橘猫</p>
            </button>
            <div className="flex-shrink-0 w-36 flex flex-col items-center justify-center">
              <button 
                onClick={() => navigate("/adoption/add")}
                className="w-36 h-48 rounded-[28px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-white text-ink-muted/40 hover:bg-gray-50 active:scale-95 transition-all mb-3"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">添加宠物</span>
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 text-ink">领养进度</h3>
          <button 
            onClick={() => navigate("/adoption/3")}
            className="w-full text-left bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-start">
              <div className="w-14 h-14 rounded-2xl overflow-hidden mr-4 flex-shrink-0 border border-gray-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2669&auto=format&fit=crop"
                  alt="小白"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-base text-ink">
                    小白的领养申请
                  </h4>
                  <span className="text-[11px] text-ink-muted/60 font-medium">昨天</span>
                </div>
                <p className="text-sm font-bold text-primary mb-3">
                  背景调查审核中
                </p>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-primary rounded-full w-[60%] shadow-[0_0_8px_rgba(178,97,52,0.4)]"></div>
                </div>
                <p className="text-[11px] text-ink-muted/60 leading-relaxed">
                  工作人员预计在1-2个工作日内与您联系
                </p>
              </div>
            </div>
          </button>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-5 text-ink">常用工具</h3>
          <div className="grid grid-cols-4 gap-4">
            <button 
              onClick={() => navigate("/chat/1")}
              className="flex flex-col items-center space-y-2 group active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-sm">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-ink">
                医疗记录
              </span>
            </button>
            <button 
              onClick={() => navigate("/chat/1")}
              className="flex flex-col items-center space-y-2 group active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-ink">
                捐赠记录
              </span>
            </button>
            <button 
              onClick={() => navigate("/chat/1")}
              className="flex flex-col items-center space-y-2 group active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <Medal className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-ink">
                志愿徽章
              </span>
            </button>
            <button 
              onClick={() => navigate("/chat/1")}
              className="flex flex-col items-center space-y-2 group active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-ink-muted shadow-sm">
                <HelpCircle className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-ink">
                帮助中心
              </span>
            </button>
          </div>
        </section>
      </div>

      <BottomNav />
    </motion.div>
  );
}
