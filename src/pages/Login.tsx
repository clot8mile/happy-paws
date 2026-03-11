import React, { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  EyeOff,
  Eye,
  MessageCircle,
  Apple,
  PawPrint,
} from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "登录失败，请检查邮箱和密码");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto"
    >
      <header className="flex items-center p-4 pb-2 justify-between z-10 relative bg-bg-main">
        <button
          onClick={() => navigate(-1)}
          className="flex w-12 h-12 shrink-0 items-center justify-center text-ink rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
        <div className="mb-10 mt-4 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6 rotate-3">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-ink">欢迎回来！</h1>
          <p className="text-ink-muted text-sm">
            登录您的账号，继续为毛孩寻找温暖
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium pl-1 text-ink-muted">邮箱</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-ink-muted/50 w-5 h-5" />
              <input
                type="email"
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-gray-200 bg-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary text-ink placeholder:text-ink-muted/40 transition-all outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium text-ink-muted">密码</label>
              <button type="button" className="text-xs font-bold text-primary hover:underline">
                忘记密码？
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-ink-muted/50 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-gray-200 bg-white h-14 pl-12 pr-12 focus:ring-2 focus:ring-primary focus:border-primary text-ink placeholder:text-ink-muted/40 transition-all outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-ink-muted/50 hover:text-ink"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-full h-14 shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "立即登录"}
          </button>
        </form>

        <div className="mt-12 mb-8 flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-sm text-ink-muted/60 font-medium">其他方式登录</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="flex justify-center gap-6">
          <button className="w-14 h-14 rounded-full bg-white border border-gray-100 text-[#07C160] flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <MessageCircle className="w-7 h-7" />
          </button>
          <button className="w-14 h-14 rounded-full bg-white border border-gray-100 text-ink flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <Apple className="w-7 h-7" />
          </button>
        </div>

        <div className="mt-auto pt-12 pb-6 text-center">
          <p className="text-sm text-ink-muted">
            还没有账号？{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </main>
    </motion.div>
  );
}
