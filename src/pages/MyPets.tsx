import { motion } from "motion/react";
import { ArrowLeft, PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdoptions } from "../context/AdoptionContext";

export default function MyPets() {
  const navigate = useNavigate();
  const { applications } = useAdoptions();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col bg-bg-main h-full"
    >
      <header className="flex items-center p-4 bg-white shadow-sm z-10 sticky top-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-ink hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold ml-2 text-ink">我的主子</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {applications.map((pet) => {
            // Parse petInfo if possible, or just display it
            // petInfo format: "Breed / Age / Gender"
            const infoParts = pet.petInfo.split(" / ");
            const breed = infoParts[0] || "";
            const age = infoParts[1] || "";

            return (
              <div
                key={pet.id}
                className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/adoption/${pet.id}`)}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={pet.image}
                    alt={pet.petName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-ink truncate">
                      {pet.petName}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        pet.status === "已领养"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {pet.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted mb-1">{breed}</p>
                  <div className="flex items-center gap-2 text-xs text-ink-muted/60">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                      {age}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Pet Card */}
          <button
            onClick={() => navigate("/adoption/add")}
            className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-ink-muted hover:border-primary/50 hover:text-primary transition-colors min-h-[120px]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-1 group-hover:bg-primary/10 transition-colors">
              <PawPrint className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">添加新宠物</span>
          </button>
        </div>
      </main>
    </motion.div>
  );
}
