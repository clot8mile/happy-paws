import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, ChevronDown, Heart, X, Dog, Cat, PawPrint } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";

export default function Discover() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("全部");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState("distance"); // distance or age

  // Advanced Filters
  const [filterType, setFilterType] = useState("全部");
  const [filterBreed, setFilterBreed] = useState("");
  const [filterGender, setFilterGender] = useState("全部");
  const [filterAge, setFilterAge] = useState("全部");
  const [filterSize, setFilterSize] = useState("全部");

  const filters = [
    { label: "全部", icon: "🐾" },
    { label: "猫", icon: "🐱" },
    { label: "狗", icon: "🐶" },
  ];

  const [pets, setPets] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Attempt to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation denied or error:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        let url = `/pets?sort=${sortBy}`;
        if (activeFilter !== "全部") {
          url += `&type=${activeFilter}`;
        }
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }
        if (filterGender !== "全部") {
          url += `&gender=${filterGender}`;
        }
        if (userLocation) {
          url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
        }
        
        const response = await fetch(`http://127.0.0.1:3001/api${url}`);
        const data = await response.json();
        
        // Simple client-side filtering for size & age if needed (since backend only handles basic cases)
        let processedData = data;
        
        if (filterAge !== "全部") {
           processedData = processedData.filter((pet: any) => {
              if (filterAge === "幼年") return pet.age_months <= 12;
              if (filterAge === "青年") return pet.age_months > 12 && pet.age_months <= 36;
              if (filterAge === "成年") return pet.age_months > 36 && pet.age_months <= 84;
              if (filterAge === "老年") return pet.age_months > 84;
              return true;
           });
        }
        
        setPets(processedData);
      } catch (err) {
        console.error("Fetch pets error:", err);
      }
    };

    fetchPets();
  }, [sortBy, activeFilter, searchQuery, filterGender, filterAge, filterSize, userLocation]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto pb-24"
    >
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            发现宠物
          </h1>
          <button 
            onClick={() => setShowFilterModal(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
              sortBy !== "distance" 
                ? "bg-primary text-white border-primary shadow-sm" 
                : "bg-gray-50 text-ink border-gray-100"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted/50" />
          <input
            type="text"
            placeholder="搜索您心仪的宠物..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-10 text-[15px] outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-ink"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <div className="px-5 py-4 overflow-x-auto scrollbar-hide flex space-x-3 bg-white border-b border-gray-50">
        {filters.map((filter, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFilter(filter.label)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-[15px] font-bold whitespace-nowrap transition-all ${
              activeFilter === filter.label
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                : "bg-gray-50 text-ink-muted border border-gray-100 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      <main className="flex-1 px-5 py-4">
        {pets.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-50 relative"
              >
                <Link to={`/pet/${pet.id}`} className="block">
                  <div className="relative aspect-square w-full bg-gray-100">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h2 className="text-lg font-bold text-ink">
                        {pet.name}
                      </h2>
                      <span
                        className={`text-lg ${pet.gender === "female" ? "text-pink-500" : "text-blue-500"}`}
                      >
                        {pet.gender === "female" ? "♀" : "♂"}
                      </span>
                    </div>
                    <p className="text-sm text-ink-muted mb-2">{pet.breed}</p>
                    <div className="flex justify-between items-center text-xs text-ink-muted/60">
                      <span>{pet.age}</span>
                      <span>·</span>
                      <span>{pet.distance}</span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(pet);
                  }}
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${isFavorite(pet.id) ? "bg-red-50 text-red-500" : "bg-white/50 backdrop-blur-sm text-gray-800"}`}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite(pet.id) ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            没有找到匹配的宠物
          </div>
        )}
      </main>

      <BottomNav />

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] z-[70] p-6 pb-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-ink">筛选宠物</h2>
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-ink-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Sort By */}
                <div>
                  <h3 className="text-[15px] font-bold text-ink mb-3">排序方式</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSortBy("distance")}
                      className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                        sortBy === "distance"
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-white border-gray-100 text-ink-muted"
                      }`}
                    >
                      距离最近
                    </button>
                    <button
                      onClick={() => setSortBy("age")}
                      className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                        sortBy === "age"
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-white border-gray-100 text-ink-muted"
                      }`}
                    >
                      年龄最小
                    </button>
                  </div>
                </div>

                {/* Pet Type */}
                <div>
                  <h3 className="text-[15px] font-bold text-ink mb-3">宠物类型</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "狗", label: "狗", icon: Dog },
                      { id: "猫", label: "猫", icon: Cat },
                      { id: "其他", label: "其他", icon: PawPrint },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFilterType(type.id)}
                        className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                          filterType === type.id
                            ? "bg-primary/5 border-primary text-primary"
                            : "bg-white border-gray-100 text-ink-muted/40"
                        }`}
                      >
                        <type.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breed */}
                <div>
                  <h3 className="text-[15px] font-bold text-ink mb-3">品种</h3>
                  <div className="relative">
                    <select
                      value={filterBreed}
                      onChange={(e) => setFilterBreed(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-[15px] appearance-none outline-none focus:border-primary transition-all text-ink"
                    >
                      <option value="">选择品种</option>
                      <option value="golden">金毛寻回犬</option>
                      <option value="poodle">贵宾犬</option>
                      <option value="shorthair">短毛猫</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted/40 pointer-events-none" />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <h3 className="text-[15px] font-bold text-ink mb-3">性别</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {["公", "母", "全部"].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setFilterGender(gender)}
                        className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                          filterGender === gender
                            ? "bg-primary/5 border-primary text-primary"
                            : "bg-white border-gray-100 text-ink-muted"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <h3 className="text-[15px] font-bold text-ink mb-3">年龄</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {["全部", "幼年", "青年", "成年", "老年"].map((age) => (
                      <button
                        key={age}
                        onClick={() => setFilterAge(age)}
                        className={`py-3 rounded-xl border font-medium text-xs transition-all ${
                          filterAge === age
                            ? "bg-primary/5 border-primary text-primary"
                            : "bg-white border-gray-100 text-ink-muted"
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h3 className="text-[15px] font-bold text-ink mb-3">体型</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "全部", label: "全部" },
                      { id: "小型", label: "小型" },
                      { id: "中型", label: "中型" },
                      { id: "大型", label: "大型" },
                    ].map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setFilterSize(size.id)}
                        className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                          filterSize === size.id
                            ? "bg-primary/5 border-primary text-primary"
                            : "bg-white border-gray-100 text-ink-muted"
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (filterType === "狗") setActiveFilter("狗");
                      else if (filterType === "猫") setActiveFilter("猫");
                      else setActiveFilter("全部");
                      setShowFilterModal(false);
                    }}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all uppercase tracking-wider"
                  >
                    立即搜索
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
