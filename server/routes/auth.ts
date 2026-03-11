import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// POST /api/auth/register - 用户注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    console.log(`[Auth] Attempting registration for: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少需要6位' });
    }

    // 使用 Supabase Auth 创建用户
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: name || email.split('@')[0] },
    });

    if (error) {
      console.error('[Auth] Supabase registration error:', error);
      if (error.message.includes('already registered')) {
        return res.status(400).json({ error: '该邮箱已被注册' });
      }
      return res.status(400).json({ error: error.message });
    }

    console.log(`[Auth] User created successfully: ${data.user.id}`);

    // 用创建的用户凭据登录以获取 token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      return res.status(500).json({ error: '注册成功但登录失败，请手动登录' });
    }

    return res.status(201).json({
      message: '注册成功',
      token: signInData.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email?.split('@')[0],
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/auth/login - 用户登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 获取用户资料
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return res.json({
      message: '登录成功',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.email?.split('@')[0],
        bio: profile?.bio || '',
        location: profile?.location || '',
        avatar: profile?.avatar || '',
        tags: profile?.tags || ['爱心领养人'],
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/auth/logout - 用户注销
router.post('/logout', async (_req: Request, res: Response) => {
  // 客户端删除 token 即可，服务端无需操作
  return res.json({ message: '已注销' });
});

export default router;
