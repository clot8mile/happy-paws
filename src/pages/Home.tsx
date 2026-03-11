import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Heart, Clock, ChevronRight, PawPrint, X, Bell, ArrowRight, Loader2 } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import { api } from "../lib/api";

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  type: string;
  images: string[];
  location: string;
  is_new: boolean;
  added_time?: string;
}

export default function Home() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [showTipModal, setShowTipModal] = useState(false);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<Pet[]>('/pets')
      .then(data => setAllPets(data))
      .catch(err => console.error('Failed to load pets:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Helper to normalize pet data for FavoriteContext
  function toPetFav(pet: Pet) {
    return {
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      image: pet.images?.[0] || '',
      gender: pet.gender,
      location: pet.location,
    };
  }

  const filteredPets = allPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const typeLabel = pet.type === 'dog' ? '狗狗' : pet.type === 'cat' ? '猫猫' : pet.type;
    const matchesCategory = category === "全部" || typeLabel === category || pet.type === category;
    return matchesSearch && matchesCategory;
  });

  const recommendedPets = filteredPets.filter(pet => !pet.is_new);
  const newPets = filteredPets.filter(pet => pet.is_new);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto pb-24 relative"
    >
      <header className="px-5 pt-12 pb-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary flex-shrink-0">
          <PawPrint className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold flex-1 text-center pr-12 text-ink">
          领养宠物
        </h1>
      </header>

      <div className="px-5 mb-6">
        <div className="bg-gray-100 rounded-full py-3 px-5 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索宠物、品种..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-ink placeholder-gray-400 text-[15px] min-w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Activity Announcement */}
      <div className="px-5 mb-6">
        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-sm cursor-pointer group">
          <img 
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80" 
            alt="Adoption Event" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          
          <div className="absolute inset-0 p-5 flex flex-col justify-center items-start text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">进行中</span>
            </div>
            <h3 className="text-xl font-bold mb-1">春季领养日活动</h3>
            <p className="text-sm text-white/90 mb-3 max-w-[70%]">本周六下午2点 · 中央公园</p>
            <div className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
              <span>查看详情</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>



      <section className="mb-8">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-ink">推荐宠物</h2>
          <button onClick={() => navigate("/discover")} className="text-primary text-[15px] font-medium">
            查看全部
          </button>
        </div>
        {isLoading ? (
          <div className="flex px-5 gap-4 pb-4">
            {[1,2].map(i => <div key={i} className="bg-gray-100 rounded-2xl flex-shrink-0 w-64 h-72 animate-pulse" />)}
          </div>
        ) : recommendedPets.length > 0 ? (
          <div className="flex overflow-x-auto px-5 gap-4 pb-4 scrollbar-hide">
            {recommendedPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl flex-shrink-0 w-64 shadow-sm border border-gray-100 overflow-hidden relative"
              >
                <Link to={`/pet/${pet.id}`} className="block">
                  <div className="relative h-48 w-full">
                    <img
                      src={pet.images?.[0] || ''}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 text-gray-800">
                      <span className={`${pet.gender === "female" ? "text-pink-500" : "text-blue-500"} font-bold`}>
                        {pet.gender === "female" ? "♀" : "♂"}
                      </span>{" "}
                      {pet.gender === "female" ? "女孩" : "男孩"}, {pet.age}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <h3 className="text-xl font-bold text-ink truncate">{pet.name}</h3>
                      <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-md flex-shrink-0">可领养</span>
                    </div>
                    <p className="text-ink-muted text-[15px] mb-2 truncate">{pet.breed}</p>
                    <p className="text-ink-muted/60 text-xs truncate">{pet.location}</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toPetFav(pet)); }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${isFavorite(pet.id) ? "bg-red-50 text-red-500" : "bg-white/50 backdrop-blur-md text-gray-700"}`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(pet.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 text-gray-400 text-sm py-4">没有找到匹配的推荐宠物</div>
        )}
      </section>

      <div className="px-5 mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setCategory("全部")}
          className={`${category === "全部" ? "bg-[#8B5E3C] text-white" : "bg-gray-200 text-gray-600"} rounded-full px-6 py-2 text-[15px] font-medium whitespace-nowrap transition-colors`}
        >
          全部
        </button>
        <button 
          onClick={() => setCategory("狗狗")}
          className={`${category === "狗狗" ? "bg-[#8B5E3C] text-white" : "bg-gray-200 text-gray-600"} rounded-full px-6 py-2 text-[15px] font-medium whitespace-nowrap flex items-center gap-2 transition-colors`}
        >
          <PawPrint className="w-4 h-4" /> 狗狗
        </button>
        <button 
          onClick={() => setCategory("猫猫")}
          className={`${category === "猫猫" ? "bg-[#8B5E3C] text-white" : "bg-gray-200 text-gray-600"} rounded-full px-6 py-2 text-[15px] font-medium whitespace-nowrap flex items-center gap-2 transition-colors`}
        >
          <PawPrint className="w-4 h-4" /> 猫猫
        </button>
      </div>

      <section className="px-5 mb-8">
        <h2 className="text-xl font-bold mb-4 text-ink">新到宠物</h2>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1,2].map(i => <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />)}
            </div>
          ) : newPets.length > 0 ? newPets.map((pet) => (
            <Link to={`/pet/${pet.id}`} key={pet.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10">
                <img src={pet.images?.[0] || ''} alt={pet.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold mb-1 text-ink truncate">{pet.name}</h3>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toPetFav(pet)); }}
                      className={`flex-shrink-0 ${isFavorite(pet.id) ? "text-red-500" : "text-ink-muted/30"}`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(pet.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <p className="text-ink-muted text-[14px] truncate">
                    {pet.breed} · {pet.gender === "female" ? "母" : "公"} · {pet.age}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-ink-muted/60 text-xs mt-1">
                  <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{pet.added_time}</span>
                </div>
              </div>
            </Link>
          )) : (
            <div className="text-ink-muted text-sm py-4">没有找到匹配的新到宠物</div>
          )}
        </div>
      </section>

      <section className="px-5 mb-8">
        <button 
          onClick={() => setShowTipModal(true)}
          className="w-full text-left bg-secondary/10 rounded-2xl p-4 flex items-center gap-4 border border-secondary/20 active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 text-secondary">
            <PawPrint className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[15px] text-ink mb-1 truncate">
              养宠小贴士
            </h4>
            <p className="text-xs text-ink-muted leading-snug break-words">
              准备迎接新狗狗？请确保低矮柜子对宠物安全，并固定松散的电线。
            </p>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-ink-muted">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </section>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative"
          >
            <button 
              onClick={() => setShowTipModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4">
              <PawPrint className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">居家安全指南</h3>
            <p className="text-ink-muted text-sm mb-4 leading-relaxed">
              为了确保新宠物的安全，请在带它们回家前完成以下准备：
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-ink-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                收起所有可能被误食的小物件（如硬币、发夹）。
              </li>
              <li className="flex items-start gap-2 text-sm text-ink-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                使用理线器固定所有暴露在外的电线。
              </li>
              <li className="flex items-start gap-2 text-sm text-ink-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                将对宠物有毒的植物（如百合、绿萝）移至它们接触不到的地方。
              </li>
              <li className="flex items-start gap-2 text-sm text-ink-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                确保垃圾桶有盖子且不易被推翻。
              </li>
            </ul>
            <button 
              onClick={() => setShowTipModal(false)}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl"
            >
              我知道了
            </button>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </motion.div>
  );
}
