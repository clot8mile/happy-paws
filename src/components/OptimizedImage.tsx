import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageOff } from "lucide-react";

interface OptimizedImageProps {
  src: any;
  alt: string;
  className?: string;
  fallbackText?: string;
}

/**
 * 统一的图片处理组件
 * 1. 处理复杂的数据结构（JSON 字符串或数组）
 * 2. 提供骨架屏加载效果
 * 3. 统一图片加载失败后的表现
 */
export default function OptimizedImage({ src, alt, className = "", fallbackText }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState("");

  useEffect(() => {
    setIsLoaded(false);
    setError(false);
    
    // 解析各种可能的图片格式
    let resolvedSrc = "";
    if (Array.isArray(src) && src.length > 0) {
      resolvedSrc = src[0];
    } else if (typeof src === 'string') {
      if (src.startsWith('{')) {
        resolvedSrc = src.replace(/[\{\}]/g, '').split(',')[0];
      } else if (src.startsWith('http')) {
        resolvedSrc = src;
      }
    }
    
    // 如果没解析出来，可能是空
    if (!resolvedSrc) {
       setError(true);
    } else {
       setDisplaySrc(resolvedSrc);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* 骨架屏加载态 */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer z-10"
          />
        )}
      </AnimatePresence>

      {/* 错误态展示 */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 p-2 text-center">
          <ImageOff className="w-8 h-8 mb-1 opacity-20" />
          {fallbackText && <span className="text-[10px]">{fallbackText}</span>}
        </div>
      ) : (
        <img
          src={displaySrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />
      )}
    </div>
  );
}
