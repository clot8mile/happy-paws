import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import petsRoutes from './routes/pets.js';
import adoptionsRoutes from './routes/adoptions.js';
import usersRoutes from './routes/users.js';
import favoritesRoutes from './routes/favorites.js';
import chatsRoutes from './routes/chats.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: '快乐爪爪救助站 API 服务运行中' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/adoptions', adoptionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/chats', chatsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'API 接口不存在' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ 快乐爪爪救助站 API 服务启动成功: http://127.0.0.1:${PORT}`);
});

export default app;
