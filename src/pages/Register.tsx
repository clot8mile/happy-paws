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
  User,
} from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("密码至少需要6位");
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password, name);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "注册失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col bg-background-light overflow-y-auto"
    >
      <header className="flex items-center p-4 pb-2 justify-between z-10 relative bg-background-light">
        <button
          onClick={() => navigate(-1)}
          className="flex w-12 h-12 shrink-0 items-center justify-center text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-12">创建账号</h2>
      </header>

      <main className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
        <div className="mb-8 px-2 text-center">
          <h1 className="text-3xl font-bold mb-2 text-primary">欢迎加入！</h1>
          <p className="text-slate-500 text-sm">注册账号，为流浪毛孩找一个温暖的家</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium pl-1 text-slate-700">昵称</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="请输入您的昵称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium pl-1 text-slate-700">邮箱</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="请输入您的邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium pl-1 text-slate-700">设置密码</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码 (至少6位)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 h-14 pl-12 pr-12 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600"
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
            ) : "注册并开启领养之旅"}
          </button>

          <p className="text-center text-xs text-slate-500 mt-2">
            注册即代表您同意我们的{" "}
            <a href="#" className="text-primary hover:underline">服务条款</a>{" "}
            和{" "}
            <a href="#" className="text-primary hover:underline">隐私政策</a>
          </p>
        </form>

        <div className="mt-10 mb-8 flex items-center gap-4">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-sm text-slate-400 font-medium">其他方式登录</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="flex justify-center gap-6">
          <button className="w-14 h-14 rounded-full bg-[#07C160]/10 text-[#07C160] flex items-center justify-center hover:bg-[#07C160]/20 transition-colors">
            <MessageCircle className="w-7 h-7" />
          </button>
          <button className="w-14 h-14 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <Apple className="w-7 h-7" />
          </button>
        </div>

        <div className="mt-auto pt-8 pb-4 text-center">
          <p className="text-sm text-slate-600">
            已有账号？{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">去登录</Link>
          </p>
        </div>
      </main>
    </motion.div>
  );
}
