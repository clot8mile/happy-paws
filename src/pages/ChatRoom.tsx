import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MoreHorizontal, PlusCircle, Send, CheckCheck, Mic, Smile, AudioLines } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import { supabase } from "../lib/supabase";
import { Message } from "../types";

// Local Message interface is now imported from ../types

export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { markAsRead, conversations } = useChat();
  const { authUser, profile } = useUser();
  const { showToast } = useNotification();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const conversation = conversations.find(c => c.id === id);

  // Sync Supabase session with our auth token
  useEffect(() => {
    if (authUser?.token) {
      console.log("Syncing Supabase session...");
      supabase.auth.setSession({
        access_token: authUser.token,
        refresh_token: '', // We don't have this from custom backend usually
      }).then(({ error }) => {
        if (error) console.error("Supabase session sync error:", error);
        else console.log("Supabase session synced successfully");
      });
    }
  }, [authUser]);

  // Load message history from Supabase
  useEffect(() => {
    if (!id || !authUser) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        if (data) {
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender_id === authUser.id ? "me" : "them",
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: msg.is_read ? "read" : "sent",
            avatar: msg.sender_id === authUser.id ? profile.avatar : conversation?.avatar,
            name: msg.sender_id === authUser.id ? profile.name : conversation?.name,
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("fetchMessages failed:", err);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${id}`,
        },
        payload => {
          const newMsg = payload.new;
          setMessages(prev => [...prev, {
            id: newMsg.id,
            text: newMsg.content,
            sender: newMsg.sender_id === authUser.id ? "me" : "them",
            time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: newMsg.is_read ? "read" : "sent",
            avatar: newMsg.sender_id === authUser.id ? profile.avatar : conversation?.avatar,
            name: newMsg.sender_id === authUser.id ? profile.name : conversation?.name,
          }]);
          
          if (newMsg.sender_id !== authUser.id) {
            markAsRead(id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, authUser, conversation, profile.avatar, profile.name]);

  useEffect(() => {
    if (id && conversation && conversation.unread > 0) {
      markAsRead(id);
    }
  }, [id, markAsRead, conversation]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.menu-trigger')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast("您的浏览器不支持语音输入功能", "warning");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !authUser || !id) return;
    
    const messageContent = inputValue.trim();
    setInputValue("");
    
    console.log("Sending message to chat_id:", id);
    
    // In a real app, you'd have a real receiver user.
    // For this prototype, we'll try to use a valid UUID or null if the schema allows.
    // If id='1', it's the rescue station. 
    // We'll try to send for now without a receiver_id if it fails with the placeholder.
    const messageData: any = {
      chat_id: id,
      sender_id: authUser.id,
      content: messageContent,
    };

    // Only add receiver_id if it's not a placeholder that might fail FK
    if (id === "1") {
       // Ideally this is the rescue station owner's ID
       // messageData.receiver_id = "..."; 
    }

    const { error } = await supabase.from('messages').insert(messageData);

    if (error) {
       console.error("Send message error details:", error);
       showToast("发送失败，请稍后重试", "error");
    } else {
       console.log("Message sent successfully");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col bg-[#F5F5F5] h-[100dvh] overflow-hidden"
    >
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between z-20 border-b border-gray-100 relative">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-slate-900 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-[17px] font-bold text-slate-900 leading-tight">快乐爪爪救助站</h1>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span className="text-[10px] text-green-600 font-medium">在线</span>
          </div>
        </div>
        
        <div className="relative menu-trigger z-10">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="w-6 h-6" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden origin-top-right"
              >
                <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <span>查看详情</span>
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <span>查找聊天记录</span>
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                  <span>清空聊天记录</span>
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                  <span>投诉</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Pet Context Bar */}
      <div className="bg-white m-3 p-3 rounded-xl flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4VztHM6RxwWxwxuu2yMipec9rREVczjI4iWGTQirtUgbNfsQI2Mmpa0I_ga2aArfaWlVFwIky8j59qJxTgEQzglxJ7e1zF4eGZq6gk4YufiVk36dQK8sQIqPKJ3gqgAQha9DdGKze5UqgY8B_MVew-D7qNCR7S7GsS2m2rBHX4ks7QSa1OplcZvJ-7QeQPlCiXMFHy8vKgHuVrS7Y5-w6g2lxztZ6W4zJ5JvBKXNpVtPVxs0w5gZLGeg6VkqxBd7AXMM9Xb23YaY"
            alt="Bella"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-bold text-sm text-slate-900">Bella</h2>
            <p className="text-[11px] text-gray-500">金毛寻回犬混血 · 2岁</p>
          </div>
        </div>
        <button className="bg-[#A0522D] hover:bg-[#8B4513] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm transition-all active:scale-95">
          预约见面
        </button>
      </div>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-4 flex flex-col gap-4"
      >
        <div className="flex justify-center my-2">
          <span className="bg-[#E0E0E0] text-gray-500 text-[11px] px-2 py-0.5 rounded-md">
            今天
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isMe = msg.sender === "me";
            const isSequence = index > 0 && messages[index - 1].sender === msg.sender;
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} ${isSequence ? "-mt-2" : ""}`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 flex-shrink-0">
                  {!isSequence && (
                    <img
                      src={msg.avatar}
                      alt={msg.name || "User"}
                      className="w-9 h-9 rounded-md object-cover shadow-sm"
                    />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && !isSequence && (
                    <span className="text-[10px] text-gray-500 ml-1 mb-1">
                      {msg.name}
                    </span>
                  )}
                  
                  <div
                    className={`relative px-3 py-2 shadow-sm text-[15px] leading-relaxed break-words ${
                      isMe
                        ? "bg-[#A0522D] text-white rounded-lg"
                        : "bg-white text-slate-800 border border-gray-100 rounded-lg"
                    }`}
                  >
                    <p className={`mb-1 ${isMe ? "text-white" : "text-slate-800"}`}>{msg.text}</p>
                    
                    {/* Timestamp */}
                    <div className={`flex justify-end items-center gap-1 text-[9px] ${isMe ? "text-white/70" : "text-gray-400"}`}>
                      <span>{msg.time}</span>
                      {isMe && (
                        <CheckCheck className={`w-3 h-3 ${msg.status === "read" ? "text-white" : "text-white/50"}`} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      {/* Input Area */}
      <div className="bg-[#F7F7F7] px-4 py-3 border-t border-gray-200 z-20 pb-safe">
        <div className="flex items-center gap-3">
          {/* Voice Icon */}
          <button className="flex-shrink-0 text-[#181818] hover:text-black transition-colors">
             <div className="w-7 h-7 rounded-full border-[1.5px] border-[#181818] flex items-center justify-center">
                <AudioLines className="w-4 h-4 text-[#181818]" />
             </div>
          </button>
          
          {/* Input Field */}
          <div className="flex-1 flex items-center bg-white rounded-2xl px-3 py-2.5 gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-[15px] text-slate-900 placeholder-gray-400 outline-none p-0"
            />
            
            {/* Smile Icon */}
            <div className="relative flex-shrink-0" ref={emojiPickerRef}>
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
              >
                <Smile className="w-6 h-6 stroke-[1.5]" />
              </button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full right-[-60px] mb-4 z-50 shadow-2xl rounded-2xl"
                  >
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick}
                      width={300}
                      height={400}
                      lazyLoadEmojis={true}
                      previewConfig={{ showPreview: false }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={toggleListening}
              className={`${isListening ? "text-red-500 animate-pulse" : "text-gray-500"} transition-colors flex-shrink-0`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* Plus Icon or Send Button */}
          {inputValue.trim() ? (
            <button 
              onClick={handleSend}
              className="flex-shrink-0 bg-[#A0522D] text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-all active:scale-95"
            >
              发送
            </button>
          ) : (
             <button className="flex-shrink-0 text-[#181818] hover:text-black transition-colors">
               <PlusCircle className="w-7 h-7 stroke-[1.5]" />
             </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
