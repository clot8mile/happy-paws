import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未授权：缺少 Token' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: '未授权：Token 无效或已过期' });
    }

    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch (err) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
