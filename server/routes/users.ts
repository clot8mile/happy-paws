import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/users/me - 获取当前用户资料
router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId!)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: '用户不存在' });
    }

    return res.json(data);
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// PUT /api/users/me - 更新当前用户资料
router.put('/me', async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, location, avatar, tags } = req.body;

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (avatar !== undefined) updates.avatar = avatar;
    if (tags !== undefined) updates.tags = tags;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.userId!)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
