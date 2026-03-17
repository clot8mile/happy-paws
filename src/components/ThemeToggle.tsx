import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "motion/react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-gray-100 dark:bg-border-subtle p-1 transition-colors duration-300 focus:outline-none"
    >
      <motion.div
        animate={{
          x: theme === "dark" ? 24 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full bg-white dark:bg-primary shadow-sm flex items-center justify-center overflow-hidden"
      >
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "light" ? (
            <Sun className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-white" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}
