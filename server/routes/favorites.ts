import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/favorites - 获取当前用户的收藏列表（含宠物详情）
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('pet_id, pets(*)')
      .eq('user_id', req.userId!);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const pets = (data || []).map((fav: any) => fav.pets).filter(Boolean);
    return res.json(pets);
  } catch (err) {
    console.error('Get favorites error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/favorites/:petId - 切换收藏状态
router.post('/:petId', async (req: AuthRequest, res: Response) => {
  try {
    const { petId } = req.params;

    // 检查是否已收藏
    const { data: existing } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', req.userId!)
      .eq('pet_id', petId)
      .single();

    if (existing) {
      // 已收藏 → 取消
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', req.userId!)
        .eq('pet_id', petId);

      return res.json({ favorited: false, message: '已取消收藏' });
    } else {
      // 未收藏 → 添加
      await supabase
        .from('favorites')
        .insert({ user_id: req.userId, pet_id: petId });

      return res.json({ favorited: true, message: '已添加收藏' });
    }
  } catch (err) {
    console.error('Toggle favorite error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
