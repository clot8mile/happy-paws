import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/chats - 获取当前用户的聊天会话列表
// 静态会话数据与用户的已读/未读状态合并
const STATIC_CONVERSATIONS = [
  {
    id: '1',
    name: '快乐爪爪救助站',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKX9sc9oJwb1lQSKzG-14Qj2Gh40fXGnvElkjG7fDDTmmFTYVNGXFlTurhSVBgI3idBLGP5vrq5nd3-sf7LTWLUOBqPazNXmIVineDBVAgjjDSSFiHW-dvUG7EzqwGJp0i9IAdaKhEJo0O5bbyRl1CrHqAqec14M6rQA72Q8GOO8m4yXMTFfmvC9YxoN0xnbzqk3ArNptPK-RHIS-fFQD5YxMhNclqKZfo-gp1idHRwXQcGfTcZZLZevpHlKyFFWt6GyQ1WTWLpUo',
    lastMessage: '当然！她和其他狗狗相处得很好。我们周六周日 10:00-16:00 开放。周六上午 11:00 方便吗？',
    time: '9:41 AM',
    unread: 1,
    isOfficial: false,
  },
  {
    id: '2',
    name: '系统通知',
    avatar: '',
    lastMessage: '您的领养申请已提交成功，工作人员正在审核中。',
    time: '昨天',
    unread: 0,
    isOfficial: true,
    iconType: 'bell',
    color: 'bg-blue-100 text-blue-500',
  },
  {
    id: '3',
    name: '西雅图救助中心',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANO0IfqMGaLRByl1nZ1sBlE9tEjDMySepRqwhgWEq5aw-urSLNhDk8wa_13xFHyO7euNQx4iKtqgyIAaHBgtpL42aB61KUnQDiT85HskpWezs_ytlV51hrdanZZ-SeNlpMvojcLORS8BP3WhbWeJgzgAuWjexv74e8yxSoP0ysIxKVfeYxYHWV4YRB-gDOobAtZXQmckg_niqKeeoyGd5Hn7s_o6rM7OsXUMB7z5d6oqhQNR1zRIcvkyhVnTEdKktkZYXVRDGTtyA',
    lastMessage: '您好，关于Oliver的领养，我们需要补充一些信息。',
    time: '星期二',
    unread: 0,
    isOfficial: false,
  },
  {
    id: '4',
    name: '领养小助手',
    avatar: '',
    lastMessage: '恭喜！您已成为金牌志愿者。',
    time: '星期一',
    unread: 0,
    isOfficial: true,
    iconType: 'check',
    color: 'bg-green-100 text-green-500',
  },
];

router.use(authenticate);

// GET /api/chats - 获取会话列表（含用户特定的已读状态）
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    // 获取用户的聊天状态（已读/未读）
    const { data: userStates } = await supabase
      .from('user_chat_states')
      .select('*')
      .eq('user_id', req.userId!);

    const stateMap = new Map((userStates || []).map((s: any) => [s.conversation_id, s]));

    // 合并静态数据和用户状态
    const conversations = STATIC_CONVERSATIONS.map(conv => {
      const state = stateMap.get(conv.id);
      return {
        ...conv,
        unread: state ? state.unread : conv.unread,
        lastMessage: state?.last_message || conv.lastMessage,
      };
    });

    return res.json(conversations);
  } catch (err) {
    console.error('Get chats error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// PUT /api/chats/:id/read - 标记会话为已读
router.put('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await supabase
      .from('user_chat_states')
      .upsert({
        user_id: req.userId,
        conversation_id: id,
        unread: 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,conversation_id' });

    return res.json({ message: '已标记为已读' });
  } catch (err) {
    console.error('Mark read error:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
