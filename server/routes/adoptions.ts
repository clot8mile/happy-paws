import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 所有领养路由都需要登录
router.use(authenticate);

// GET /api/adoptions - 获取当前用户的领养申请列表
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('adoption_applications')
      .select('*')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // 格式化日期显示
    const formatted = (data || []).map(app => ({
      ...app,
      date: formatDate(app.created_at),
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('Get adoptions error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/adoptions/:id - 获取单个申请详情
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('adoption_applications')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId!)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: '未找到该申请' });
    }

    return res.json({ ...data, date: formatDate(data.created_at) });
  } catch (err) {
    console.error('Get adoption error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/adoptions - 提交新领养申请
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const {
      petId,
      petName,
      petInfo,
      image,
      applicantName,
      applicantPhone,
      livingCity,
      housingType,
      hasExperience,
      adoptionReason,
    } = req.body;

    if (!petName) {
      return res.status(400).json({ error: '宠物名称不能为空' });
    }

    // 防御性编程：确保用户在 public.users 表中存在
    // 有时触发器可能因为各种原因未执行，或者用户是在触发器创建前注册的
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('id', req.userId!)
      .single();

    if (profileError || !userProfile) {
      console.log(`[Adoption] User profile missing for ${req.userId}, creating one...`);
      const { error: insertProfileError } = await supabase
        .from('users')
        .insert({
          id: req.userId!,
          email: req.userEmail || '',
          name: req.userEmail?.split('@')[0] || '新用户'
        });
      
      if (insertProfileError) {
        console.error('[Adoption] Failed to create user profile:', insertProfileError);
        return res.status(500).json({ error: '无法创建用户资料，请联系管理员' });
      }
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .insert({
        user_id: req.userId,
        pet_id: petId || null,
        pet_name: petName,
        pet_info: petInfo || '',
        image: image || '',
        status: '材料审核',
        status_desc: '您的申请已提交，请耐心等待审核',
        is_active: true,
        applicant_name: applicantName || '',
        applicant_phone: applicantPhone || '',
        living_city: livingCity || '',
        housing_type: housingType || '自有住房',
        has_experience: hasExperience !== false,
        adoption_reason: adoptionReason || '',
      })
      .select()
      .single();

    if (error) {
      console.error('[Adoption] SQL Insert Error:', error);
      // 这里的错误信息可能包含数据库约束，直接返回给前端有助于调试
      return res.status(500).json({ error: error.message });
    }

    console.log('[Adoption] Application created:', data.id);

    return res.status(201).json({
      ...data,
      date: formatDate(data.created_at),
    });
  } catch (err) {
    console.error('Create adoption error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/adoptions/admin/all - 获取所有领养申请 (仅管理员)
router.get('/admin/all', async (req: AuthRequest, res: Response) => {
  try {
    // 验证是否是管理员
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId!)
      .single();

    if (user?.role !== 'admin') {
      return res.status(403).json({ error: '无权限访问' });
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .select(`
        *,
        pets (id, name, image)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Admin get adoptions error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// PUT /api/adoptions/admin/:id/status - 更新领养申请状态 (仅管理员)
router.put('/admin/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 验证是否是管理员
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId!)
      .single();

    if (user?.role !== 'admin') {
      return res.status(403).json({ error: '无权限访问' });
    }

    let statusDesc = '';
    let isActive = true;
    switch (status) {
      case 'pending': 
        statusDesc = '您的申请已收到，正在审核中';
        break;
      case 'interviewing':
        statusDesc = '我们非常期待与您进一步沟通，请准备好参与线下面试';
        break;
      case 'approved':
        statusDesc = '恭喜！您的领养申请已通过，宠物即将成为您的家人';
        isActive = false; // 归档
        break;
      case 'rejected':
        statusDesc = '很遗憾，经综合评估您的条件暂不符合该宠物的领养要求';
        isActive = false; // 归档
        break;
      default:
        statusDesc = '您的申请状态已更新';
        break;
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .update({ 
        status, 
        status_desc: statusDesc,
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // 这里可以触发发送系统通知...

    return res.json(data);
  } catch (err) {
    console.error('Admin update status error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default router;
