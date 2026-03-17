import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showToast: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showToast = useCallback((message: string, type: NotificationType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    // 3秒后自动移除
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast 容器 */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[320px] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border
                ${n.type === 'success' ? 'bg-white/90 border-green-100 text-green-600' : 
                  n.type === 'error' ? 'bg-white/90 border-red-100 text-red-600' : 
                  n.type === 'warning' ? 'bg-white/90 border-yellow-100 text-yellow-600' : 
                  'bg-white/90 border-blue-100 text-blue-600'}
              `}>
                <div className="shrink-0">
                  {n.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {n.type === 'error' && <XCircle className="w-5 h-5" />}
                  {n.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                  {n.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <p className="text-sm font-bold flex-1">{n.message}</p>
                <button 
                  onClick={() => removeNotification(n.id)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
