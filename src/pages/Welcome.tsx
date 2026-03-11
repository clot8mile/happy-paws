import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col relative bg-background-light"
    >
      <div className="flex-1 px-6 py-4 flex flex-col justify-center items-center">
        <div
          className="w-full aspect-square max-w-[360px] bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-full mb-10 border-8 border-white/50 shadow-lg"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEgBk4oXbtnMWZ8Um1NEXjaXWU9YQIDFho3ZB3PrsgUZanLEzgRbZiL-X2HPjSKKEw5100G6RckKicUXWus2-P4V92cw2_Cy-lmTiGnTXXYveSsOKfnJCpQuKbe9vMD94MyqcWUpUvrnBOgREZGezm3FkQogE5BBoeKxHrg65nHlAtXE3x65wAr3kvumcITbsca2uGaBuSy763SuyhwygBz0-RoaG_354wrF3sY38kDKiPgqU8xFmgI2W_0I1T5GffyvBGY2parG0")',
          }}
        />
        <div className="w-full flex flex-col items-center text-center">
          <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight mb-4">
            让每一只宠物都有家
          </h1>
          <p className="text-slate-600 text-base font-normal leading-relaxed mb-12 max-w-[280px]">
            加入我们的社区，为流浪动物寻找温暖的归宿
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full mt-auto pb-8">
          <Link
            to="/login"
            className="flex w-full items-center justify-center rounded-xl h-14 px-5 bg-primary text-white text-lg font-bold tracking-wide shadow-md hover:bg-primary-hover transition-colors active:scale-[0.98]"
          >
            开始
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
