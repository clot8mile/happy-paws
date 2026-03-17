import { motion } from "motion/react";
import React from "react";

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

/**
 * 带有微交互效果的通用按钮组件
 * 包含：点击缩放反馈、悬停状态、禁用状态处理
 */
export default function InteractiveButton({ 
  children, 
  onClick, 
  className = "", 
  type = "button",
  disabled = false 
}: InteractiveButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
