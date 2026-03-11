import { motion } from "motion/react";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
  Heart,
  Plus,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useFavorites } from "../context/FavoriteContext";
import { useAdoptions } from "../context/AdoptionContext";

export default function Adoption() {
  const [activeTab, setActiveTab] = useState<"progress" | "favorites" | "info">(
    "progress",
  );
  const { favorites, toggleFavorite } = useFavorites();
  const { applications } = useAdoptions();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-background-light overflow-y-auto pb-24"
    >
      <header className="px-5 pt-12 pb-4 flex justify-between items-center sticky top-0 bg-white z-10 border-b border-gray-100 mb-3 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          我的领养
        </h1>
      </header>

      <div className="px-5 py-3 bg-white flex space-x-6 border-b border-gray-100 mb-3 shadow-sm">
        <button
          onClick={() => setActiveTab("progress")}
          className={`${activeTab === "progress" ? "text-primary border-b-2 border-primary" : "text-gray-500"} font-bold pb-2 -mb-[13px] px-1`}
        >
          申请进度
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`${activeTab === "favorites" ? "text-primary border-b-2 border-primary" : "text-gray-500"} font-bold pb-2 -mb-[13px] px-1`}
        >
          我的收藏
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`${activeTab === "info" ? "text-primary border-b-2 border-primary" : "text-gray-500"} font-bold pb-2 -mb-[13px] px-1`}
        >
          领养须知
        </button>
      </div>

      <main className="flex-1 px-4 space-y-4">
        {activeTab === "progress" && (
          <>
            {applications.map((app) => (
              <Link
                key={app.id}
                to={`/adoption/${app.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">
                    申请日期: {app.date}
                  </span>
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${app.isActive ? "text-primary" : "text-green-500"}`}
                  >
                    {app.isActive ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {app.status}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={app.image}
                      alt={app.petName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {app.petName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{app.petInfo}</p>
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg inline-block">
                      {app.statusDesc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 mt-6 flex gap-3 items-start">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  领养前准备
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  领养是一辈子的承诺。在提交申请前，请确保您已经了解宠物的习性，并准备好为它提供一个稳定、充满爱的家。
                </p>
                <button className="mt-2 text-primary text-xs font-bold flex items-center">
                  查看领养指南 <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {favorites.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-50 relative">
                    <Link
                      to={`/pet/${pet.id}`}
                      className="block"
                    >
                      <div className="relative aspect-square w-full bg-gray-100">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-1">
                          <h2 className="text-lg font-bold text-slate-900">
                            {pet.name}
                          </h2>
                          <span
                            className={`text-lg ${pet.gender === "female" || pet.gender === "女孩" ? "text-pink-500" : "text-blue-500"}`}
                          >
                            {pet.gender === "female" || pet.gender === "女孩" ? "♀" : "♂"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{pet.breed}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{pet.age}</span>
                          {pet.distance && (
                            <>
                              <span>·</span>
                              <span>{pet.distance}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(pet);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm bg-red-50 text-red-500"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Heart className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm">暂无收藏的宠物</p>
                <Link to="/discover" className="mt-4 text-primary font-bold">
                  去发现心仪的宠物
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "info" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">领养须知</h3>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>1. 领养人需年满18周岁，具有完全民事行为能力。</p>
              <p>2. 领养人需有稳定的工作和收入来源，能够承担宠物的日常开销。</p>
              <p>3. 领养需征得全家人的同意，并确保居住环境允许养宠。</p>
              <p>4. 领养后需科学喂养，定期接种疫苗，适龄绝育。</p>
              <p>5. 接受救助站的定期回访（线上或线下）。</p>
              <p className="font-bold text-primary mt-4">
                领养不是一时的冲动，而是长久的守护。
              </p>
            </div>
          </div>
        )}
      </main>

      <BottomNav />

      {activeTab === "progress" && (
        <Link
          to="/adoption/add"
          className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-30 active:scale-90 transition-transform"
        >
          <Plus className="w-8 h-8" />
        </Link>
      )}
    </motion.div>
  );
}
