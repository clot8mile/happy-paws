import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/pets - 获取宠物列表（支持过滤）
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, gender, search, sort = 'distance' } = req.query;

    let query = supabase.from('pets').select('*');

    // 过滤类型
    if (type && type !== '全部' && type !== 'all') {
      if (type === '猫' || type === 'cat') {
        query = query.eq('type', 'cat');
      } else if (type === '狗' || type === 'dog') {
        query = query.eq('type', 'dog');
      }
    }

    // 过滤性别
    if (gender && gender !== '全部' && gender !== 'all') {
      if (gender === '母' || gender === 'female') {
        query = query.eq('gender', 'female');
      } else if (gender === '公' || gender === 'male') {
        query = query.eq('gender', 'male');
      }
    }

    // 搜索名称或品种
    if (search) {
      query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    let results = data || [];

    // 如果提供了用户坐标和宠物坐标(后端如果保存了经纬度)，进行实际距离计算
    // 这里我们假设宠物表有 lat, lng 字段，如果没数据就给一个模拟距离
    const userLat = parseFloat(req.query.lat as string);
    const userLng = parseFloat(req.query.lng as string);

    if (!isNaN(userLat) && !isNaN(userLng)) {
      results = results.map(pet => {
        // 简单模拟: 如果数据库有真实的 lat/lng 则计算，否则随机生成一个基于原 distance_num 附近的浮动值
        const petLat = pet.lat || 33.0 + Math.random(); 
        const petLng = pet.lng || -117.0 + Math.random();
        
        // Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (petLat - userLat) * Math.PI / 180;
        const dLng = (petLng - userLng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(petLat * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = +(R * c).toFixed(1);
        
        return {
          ...pet,
          distance_str: `${distance}km`,
          calculated_distance: distance,
        };
      });
      
      if (sort !== 'age') {
        results.sort((a, b) => (a.calculated_distance || 0) - (b.calculated_distance || 0));
      }
    } else {
      // 排序
      if (sort === 'age') {
        results.sort((a, b) => a.age_months - b.age_months);
      } else {
        results.sort((a, b) => a.distance_num - b.distance_num);
      }
    }

    return res.json(results);
  } catch (err) {
    console.error('Get pets error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/pets/:id - 获取宠物详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: '未找到该宠物' });
    }

    return res.json(data);
  } catch (err) {
    console.error('Get pet error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/pets/admin/all - 获取所有宠物用于管理 (仅管理员)
router.get('/admin/all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId!)
      .single();

    if (user?.role !== 'admin') {
      return res.status(403).json({ error: '无权限访问' });
    }

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return res.json(data || []);
  } catch (err) {
    console.error('Admin get pets error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// PUT /api/pets/admin/:id - 更新宠物信息 (仅管理员)
router.put('/admin/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId!)
      .single();

    if (user?.role !== 'admin') {
      return res.status(403).json({ error: '无权限访问' });
    }

    const { data, error } = await supabase
      .from('pets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error('Admin update pet error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// DELETE /api/pets/admin/:id - 删除/下架宠物 (仅管理员)
router.delete('/admin/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId!)
      .single();

    if (user?.role !== 'admin') {
      return res.status(403).json({ error: '无权限访问' });
    }

    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    console.error('Admin delete pet error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
