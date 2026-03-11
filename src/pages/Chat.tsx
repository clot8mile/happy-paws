import { motion } from "motion/react";
import { Search, Settings } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { Link, useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";

export default function Chat() {
  const { conversations } = useChat();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-bg-main overflow-y-auto pb-24"
    >
      <header className="px-5 pt-12 pb-4 flex justify-between items-center sticky top-0 bg-bg-main/80 backdrop-blur-md z-20">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          消息
        </h1>
        <button 
          onClick={() => navigate('/settings')}
          className="text-ink p-2 -mr-2 active:scale-95 transition-transform"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <div className="px-5 mb-5">
        <div className="bg-gray-100/50 rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100/50">
          <Search className="w-5 h-5 text-ink-muted/50" />
          <input
            type="text"
            placeholder="搜索消息、用户或群组"
            className="bg-transparent border-none outline-none text-[15px] w-full text-ink placeholder-ink-muted/40"
          />
        </div>
      </div>

      <main className="flex-1 px-5">
        <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {conversations.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className="flex items-center px-4 py-5 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <div className="relative mr-4 shrink-0">
                  {chat.isOfficial ? (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${chat.color} shadow-sm`}
                    >
                      {chat.icon && <chat.icon className="w-6 h-6" />}
                    </div>
                  ) : (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                  )}
                  {chat.unread > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                      {chat.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[16px] font-bold text-ink truncate">
                      {chat.name}
                    </h3>
                    <span className="text-[11px] text-ink-muted/60 whitespace-nowrap ml-2 font-medium">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-[13px] text-ink-muted truncate leading-snug">
                    {chat.lastMessage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </motion.div>
  );
}
