# 快乐爪爪救助站 (Happy Paws Rescue) 🐾

这是一个基于 React + Vite + Supabase + Express 构建的现代化流浪猫狗领养与救助平台。

## ✨ 核心功能

- **宠物发现 (Discover)**: 支持地理位置定位，自动计算您与宠物的物理距离并按“由近到远”排序。
- **实时沟通 (Real-time Chat)**: 基于 Supabase Realtime 的即时通讯，支持表情发送，沟通无延时。
- **领养管理 (Adoption Management)**: 完整申请流，支持在线提交领养申请并实时追踪审核状态。
- **管理后台 (Admin Dashboard)**: 管理员独有工作台，可处理领养申请、管理宠物上架状态。
- **媒体存储 (Supabase Storage)**: 支持上传真实宠物照片与用户高清头像。

## 🛠️ 技术栈

- **前端**: React 18, Vite, Lucide React, Framer Motion
- **后端**: Express.js, TypeScript, Supabase Admin SDK
- **数据库/存储**: Supabase (PostgreSQL, Storage, Realtime)
- **部署**: Vercel (前端) + Render/Heroku (后端)

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/clot8mile/-.git
cd happy-paws-rescue
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `.env.example` 并重命名为 `.env`，填入您的 Supabase 凭据：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. 启动项目
同时启动前端和后端服务：
```bash
npm run dev:all
```

## 📄 许可证
本项目采用 MIT 许可证执行。
