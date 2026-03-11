import { motion } from "motion/react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Info,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoriteContext";
import { api } from "../lib/api";

export default function PetDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get<any>(`/pets/${id}`)
        .then(data => setPet(data))
        .catch(err => console.error("Failed to fetch pet:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const isPetFavorite = pet ? isFavorite(pet.id) : false;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-main min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-main min-h-screen">
        <p className="text-ink-muted">找不到该宠物信息</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl">返回</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto pb-24 relative"
    >
      {/* Header Actions */}
      <div className="absolute top-12 left-0 right-0 px-5 flex justify-between items-center z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-ink shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-ink shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              toggleFavorite({
                id: pet.id,
                name: pet.name,
                breed: pet.breed,
                age: pet.age,
                image: pet.images?.[0] || "",
                gender: pet.gender,
              })
            }
            className={`w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors ${isPetFavorite ? "text-red-500" : "text-ink"}`}
          >
            <Heart
              className={`w-5 h-5 ${isPetFavorite ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[400px] w-full overflow-hidden bg-gray-100">
        <img
          src={pet.images?.[0] || ""}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-5 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          1 / {pet.images?.length || 1}
        </div>
      </div>

      {/* Content */}
      <main className="px-5 -mt-6 relative z-10 bg-bg-main rounded-t-[32px] pt-8 pb-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-1">
              {pet.name}
            </h1>
            <div className="flex items-center text-ink-muted text-sm">
              <MapPin className="w-4 h-4 mr-1 text-primary" />
              {pet.location}
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            {pet.status}
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-bg-warm/30 p-3 rounded-2xl flex flex-col items-center justify-center">
            <Calendar className="w-5 h-5 text-secondary mb-1" />
            <span className="text-xs text-ink-muted mb-0.5">年龄</span>
            <span className="text-sm font-bold text-ink">{pet.age}</span>
          </div>
          <div className="bg-bg-warm/30 p-3 rounded-2xl flex flex-col items-center justify-center">
            <Info className="w-5 h-5 text-secondary mb-1" />
            <span className="text-xs text-ink-muted mb-0.5">性别</span>
            <span className="text-sm font-bold text-ink">
              {pet.gender}
            </span>
          </div>
          <div className="bg-bg-warm/30 p-3 rounded-2xl flex flex-col items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-secondary mb-1" />
            <span className="text-xs text-ink-muted mb-0.5">体型</span>
            <span className="text-sm font-bold text-ink">{pet.size}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {pet.tags?.map((tag: string, index: number) => (
            <button
              key={index}
              onClick={() => navigate("/chat/1")}
              className="bg-white border border-gray-100 text-ink-muted px-4 py-1.5 rounded-xl text-xs font-medium shadow-sm active:scale-95 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold text-ink mb-3">性格特点</h2>
            <p className="text-ink-muted text-sm leading-relaxed">
              {pet.personality}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-3">健康状况</h2>
            <div className="bg-secondary/5 rounded-2xl p-4 border border-secondary/10">
              <p className="text-ink-muted text-sm leading-relaxed">
                {pet.health}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-3">背景故事</h2>
            <p className="text-ink-muted text-sm leading-relaxed">{pet.story}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-3">领养要求</h2>
            <ul className="space-y-2">
              {pet.requirements?.map((req: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-ink-muted"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  {req}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 z-30 max-w-md mx-auto">
        <button 
          onClick={() => navigate("/chat/1")}
          className="flex-1 bg-gray-100 text-ink font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
          咨询
        </button>
        <button
          onClick={() => navigate(`/adoption/apply/${pet.id}`)}
          className="flex-[2] bg-primary text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/20"
        >
          申请领养
        </button>
      </div>
    </motion.div>
  );
}
