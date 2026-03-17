import { motion } from "motion/react";
import { LucideIcon, PawPrint } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 通用的“空状态”展示组件
 * 用于列表为空、搜索无结果等场景，提升情感化体验
 */
export default function EmptyState({ 
  icon: Icon = PawPrint, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = "" 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-20 px-10 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-border-subtle rounded-full flex items-center justify-center mb-6 text-ink-muted/20">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed max-w-xs">{description}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold hover:bg-primary/20 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
