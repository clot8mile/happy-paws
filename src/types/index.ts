/**
 * 快乐爪爪救助站 - 全局类型定义
 */

// 宠物基本信息
export interface Pet {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'other';
  breed: string;
  age: string;
  age_months: number;
  gender: 'male' | 'female';
  images: string | string[]; // 可能为 JSON 字符串或数组
  image?: string; // 旧字段兼容
  description: string;
  location: string;
  lat?: number;
  lng?: number;
  distance_str?: string;
  calculated_distance?: number;
  is_adopted: boolean;
  created_at: string;
}

// 领养申请
export interface AdoptionApplication {
  id: string;
  user_id: string;
  pet_id: string | null;
  pet_name: string;
  pet_info: string;
  image: string;
  status: 'pending' | 'interviewing' | 'approved' | 'rejected' | '材料审核' | string;
  status_desc: string;
  is_active: boolean;
  applicant_name: string;
  applicant_phone: string;
  living_city: string;
  housing_type: string;
  has_experience: boolean;
  adoption_reason: string;
  created_at: string;
  updated_at: string;
  date?: string; // 格式化后的日期
  pets?: Partial<Pet>;
}

// 聊天会话
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
  iconType?: 'bell' | 'check' | string;
}

// 聊天消息
export interface Message {
  id: string;
  chat_id?: string;
  sender_id?: string;
  receiver_id?: string;
  content?: string;
  is_read?: boolean;
  created_at?: string;
  // 前端展现层扩展字段
  text?: string;
  sender?: 'me' | 'them';
  time?: string;
  status?: 'sent' | 'delivered' | 'read';
  avatar?: string;
  name?: string;
}

// 用户信息
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface AuthState {
  id: string;
  email: string;
  token: string;
}
