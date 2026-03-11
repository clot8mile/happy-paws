import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";
import { useUser } from "./UserContext";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOfficial: boolean;
  icon?: any;
  color?: string;
}

interface ChatContextType {
  conversations: Conversation[];
  totalUnread: number;
  markAsRead: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "快乐爪爪救助站",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKX9sc9oJwb1lQSKzG-14Qj2Gh40fXGnvElkjG7fDDTmmFTYVNGXFlTurhSVBgI3idBLGP5vrq5nd3-sf7LTWLUOBqPazNXmIVineDBVAgjjDSSFiHW-dvUG7EzqwGJp0i9IAdaKhEJo0O5bbyRl1CrHqAqec14M6rQA72Q8GOO8m4yXMTFfmvC9YxoN0xnbzqk3ArNptPK-RHIS-fFQD5YxMhNclqKZfo-gp1idHRwXQcGfTcZZLZevpHlKyFFWt6GyQ1WTWLpUo",
    lastMessage: "当然！她和其他狗狗相处得很好。我们周六周日 10:00-16:00 开放。周六上午 11:00 方便吗？",
    time: "9:41 AM",
    unread: 1,
    isOfficial: false,
  },
  {
    id: "2",
    name: "系统通知",
    avatar: "",
    lastMessage: "您的领养申请已提交成功，工作人员正在审核中。",
    time: "昨天",
    unread: 0,
    isOfficial: true,
    icon: Bell,
    color: "bg-blue-100 text-blue-500",
  },
  {
    id: "3",
    name: "西雅图救助中心",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuANO0IfqMGaLRByl1nZ1sBlE9tEjDMySepRqwhgWEq5aw-urSLNhDk8wa_13xFHyO7euNQx4iKtqgyIAaHBgtpL42aB61KUnQDiT85HskpWezs_ytlV51hrdanZZ-SeNlpMvojcLORS8BP3WhbWeJgzgAuWjexv74e8yxSoP0ysIxKVfeYxYHWV4YRB-gDOobAtZXQmckg_niqKeeoyGd5Hn7s_o6rM7OsXUMB7z5d6oqhQNR1zRIcvkyhVnTEdKktkZYXVRDGTtyA",
    lastMessage: "您好，关于Oliver的领养，我们需要补充一些信息。",
    time: "星期二",
    unread: 0,
    isOfficial: false,
  },
  {
    id: "4",
    name: "领养小助手",
    avatar: "",
    lastMessage: "恭喜！您已成为金牌志愿者。",
    time: "星期一",
    unread: 0,
    isOfficial: true,
    icon: CheckCircle2,
    color: "bg-green-100 text-green-500",
  },
];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  // 登录后从 API 加载对话状态
  useEffect(() => {
    if (isLoggedIn) {
      api.get<any[]>('/chats')
        .then(data => {
          // 将 API 数据与本地图标信息合并
          const merged = data.map((conv: any) => {
            const local = INITIAL_CONVERSATIONS.find(c => c.id === conv.id);
            return {
              ...conv,
              icon: local?.icon,
              color: local?.color || conv.color,
            };
          });
          setConversations(merged.length > 0 ? merged : INITIAL_CONVERSATIONS);
        })
        .catch(() => setConversations(INITIAL_CONVERSATIONS));
    }
  }, [isLoggedIn]);

  const totalUnread = conversations.reduce((acc, curr) => acc + curr.unread, 0);

  const markAsRead = useCallback((id: string) => {
    setConversations(prev =>
      prev.map(conv => (conv.id === id ? { ...conv, unread: 0 } : conv))
    );
    if (isLoggedIn) {
      api.put(`/chats/${id}/read`).catch(console.error);
    }
  }, [isLoggedIn]);

  return (
    <ChatContext.Provider value={{ conversations, totalUnread, markAsRead }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
