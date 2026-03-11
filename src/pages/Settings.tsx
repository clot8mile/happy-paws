import { motion } from "motion/react";
import { ChevronLeft, LogOut, Shield, Bell, HelpCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const settingsItems = [
    { icon: Bell, label: "通知设置", color: "text-accent", bg: "bg-accent/10" },
    { icon: Shield, label: "隐私与安全", color: "text-secondary", bg: "bg-secondary/10" },
    { icon: HelpCircle, label: "帮助与反馈", color: "text-primary", bg: "bg-primary/10" },
    { icon: Info, label: "关于我们", color: "text-ink-muted", bg: "bg-gray-100" },
  ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-bg-main z-[60] flex flex-col"
    >
      <header className="px-5 pt-12 pb-4 flex items-center gap-4 sticky top-0 bg-bg-main/80 backdrop-blur-md z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-ink active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-ink">设置</h1>
      </header>

      <main className="flex-1 px-5 py-4 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {settingsItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-ink">{item.label}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-ink-muted/30 rotate-180" />
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-white rounded-3xl p-4 flex items-center justify-center gap-2 text-red-500 font-bold shadow-sm border border-gray-50 active:scale-[0.98] transition-all">
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </main>
    </motion.div>
  );
}
