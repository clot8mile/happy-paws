import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  MessageCircle,
  PawPrint,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdoptions } from "../context/AdoptionContext";
import OptimizedImage from "../components/OptimizedImage";

export default function AdoptionProgress() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { applications } = useAdoptions();
  
  const app = applications.find(a => a.id === id) || applications[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-bg-main pb-8"
    >
      <header className="bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-ink"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-ink absolute left-1/2 transform -translate-x-1/2">
            领养进度详情
          </h1>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="flex-1">
        <div className="bg-white px-4 py-6 mb-4">
          <div className="relative flex items-center justify-between">
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 -z-0"></div>
            <div className="absolute top-5 left-6 w-1/4 h-0.5 bg-primary -z-0"></div>

            <div className="flex flex-col items-center relative z-10 w-16">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mb-2 shadow-sm">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs text-ink">提交申请</span>
            </div>

            <div className="flex flex-col items-center relative z-10 w-16">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center mb-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
              </div>
              <span className="text-xs text-primary font-medium">材料审核</span>
            </div>

            <div className="flex flex-col items-center relative z-10 w-16">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-ink-muted font-bold mb-2">
                3
              </div>
              <span className="text-xs text-ink-muted/60">线下面谈</span>
            </div>

            <div className="flex flex-col items-center relative z-10 w-16">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-ink-muted font-bold mb-2">
                4
              </div>
              <span className="text-xs text-ink-muted/60">试养阶段</span>
            </div>

            <div className="flex flex-col items-center relative z-10 w-16">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-ink-muted mb-2">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="text-xs text-ink-muted/60">正式领养</span>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 flex shadow-sm">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink mb-1">{app.petName}</h2>
                <p className="text-sm text-ink-muted mb-4">
                  {app.petInfo}
                </p>
              </div>
              <div>
                <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-xs text-ink">
                  查看领养贴 <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden ml-3 bg-gray-100">
              <OptimizedImage
                src={app.image}
                alt={app.petName}
                className="w-full h-full"
                fallbackText={app.petName}
              />
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center mb-3">
              <Clock className="w-6 h-6 text-primary mr-2" />
              <h3 className="text-lg font-bold text-primary">
                当前状态：{app.status}
              </h3>
            </div>
            <p className="text-[15px] leading-relaxed text-ink-muted mb-5">
              {app.statusDesc}
            </p>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-ink-muted/50 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-ink mb-1">
                    预计审核时间：1-3个工作日
                  </h4>
                  <p className="text-sm text-ink-muted/80 leading-snug">
                    审核通过后，志愿者将主动与您联系，安排线下面谈时间。请留意APP消息或来电。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate("/chat/1")}
            className="w-full bg-primary hover:bg-primary-hover active:bg-primary-hover text-white rounded-full py-3.5 flex items-center justify-center text-lg font-bold shadow-md transition-colors mt-6"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            联系志愿者
          </button>
        </div>
      </main>
    </motion.div>
  );
}
