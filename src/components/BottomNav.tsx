import { Link, useLocation } from "react-router-dom";
import { Home, Compass, PawPrint, MessageCircle, User } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { totalUnread } = useChat();
  const { isLoggedIn } = useUser();

  const navItems = [
    { path: "/home", icon: Home, label: "首页" },
    { path: "/discover", icon: Compass, label: "发现" },
    { path: "/adoption", icon: PawPrint, label: "领养" },
    { path: "/chat", icon: MessageCircle, label: "消息", badge: isLoggedIn ? totalUnread : 0 },
    { path: "/profile", icon: User, label: "我的" },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-2 pb-6 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-16 h-12 transition-colors relative ${
              isActive ? "text-primary" : "text-ink-muted/40 hover:text-ink-muted"
            }`}
          >
            <div className="relative">
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              {item.badge ? (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
              ) : null}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
