-- 快乐爪爪救助站 - Supabase 数据库 Schema
-- 在 Supabase 控制台的 SQL Editor 中执行此文件

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 用户资料表（扩展 Supabase Auth 的 auth.users）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL DEFAULT '新用户',
  bio TEXT DEFAULT '',
  location TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY['爱心领养人']::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS（行级安全策略）
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户可读取所有资料" ON public.users FOR SELECT USING (true);
CREATE POLICY "用户只能更新自己的资料" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "服务角色可插入" ON public.users FOR INSERT WITH CHECK (true);

-- ============================================================
-- 宠物表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  age_months INTEGER DEFAULT 0,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  type TEXT NOT NULL CHECK (type IN ('dog', 'cat', 'other')),
  size TEXT DEFAULT '中型',
  status TEXT DEFAULT '待领养',
  location TEXT DEFAULT '',
  distance TEXT DEFAULT '',
  distance_num NUMERIC DEFAULT 0,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  personality TEXT DEFAULT '',
  health TEXT DEFAULT '',
  story TEXT DEFAULT '',
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_new BOOLEAN DEFAULT FALSE,
  added_time TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "任何人可读取宠物" ON public.pets FOR SELECT USING (true);
CREATE POLICY "服务角色可管理宠物" ON public.pets FOR ALL USING (true);

-- 插入示例宠物数据
INSERT INTO public.pets (name, breed, age, age_months, gender, type, size, status, location, distance, distance_num, images, tags, personality, health, story, requirements, is_new, added_time) VALUES
(
  'Bella', '金毛寻回犬', '2 岁', 24, 'female', 'dog', '中型', '待领养',
  '上海市 静安区', '3 英里', 3,
  ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuD0-2covL_YB5MqU3dLJ8Op_A93qwN5iAFh58Y_9iFZc8IsO5EXoFMlM1cphkFhlu7oO7dClk1TQvcKvJYj20HRSiug0QoKnA0aiWDpfnjcJajAd9kx8eG9SAWAKHg46uJOOSW24HUcKCtBJ35F5NlNNlL9EmDZoMuP0GimdMTCYvizd5uRFgH41a2Qa4Q2yTSBMe2nFHbn7cspoBL5B31JxhJXMXwTaKO91fsyJAdUCXwl9FoeDGSdtoB9U87eNb-Jo6q6TiVJr-U'],
  ARRAY['活跃', '亲人', '已绝育', '疫苗齐全'],
  'Bella 是一只超级热情的狗狗！她非常喜欢和人类互动，尤其是玩接球游戏。她对其他狗狗也很友好，但在遇到猫咪时可能会有点过于兴奋。她已经学会了基本的指令，如"坐下"和"握手"。',
  'Bella 目前身体非常健康。她已经完成了所有的核心疫苗接种，并且已经进行了绝育手术。她定期进行体内外驱虫，目前没有任何已知的过敏或慢性疾病。',
  'Bella 是在三个月前被志愿者在静安区的一个公园附近发现的。当时她看起来有些消瘦且迷茫，但依然对路人摇尾巴。经过救助站的悉心照料，她现在已经恢复了活力，正在寻找一个能给她永久关爱的家。',
  ARRAY['领养人需有稳定的住房和收入', '全家人都同意领养并爱护宠物', '接受定期回访', '科学喂养，不离不弃'],
  FALSE, ''
),
(
  'Max', '混合品种', '8 个月', 8, 'male', 'dog', '小型',  '待领养',
  '上海市 徐汇区', '1.5 英里', 1.5,
  ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuCNfgJREGKv_EDE-DJVG3klwmiWSD6F-ewcw15LwM8W4jK8p8YVmEWGtd9Tv3LvPiHrRNL2Gm4yj-pvueXP4wIg2gTyCRB8et2pz03Vmt62vIkBpacEOf46CufIFyMm9adHsYLgdutoXL5o8rIAa_0b4lrVbZbV1syfFneoWmQX_I31xDmlMPVK2WnWHx-iokuCKYTG40EtW3cMp39eob9xYvwuMkoEytFOA_cYbzqmD0DynD8OUYgA1UYfaNArIkJkiPscMQzHdj0'],
  ARRAY['活泼', '聪明', '幼年'],
  'Max 是一只充满活力的小狗，喜欢跑跑跳跳。他很聪明，学东西很快。',
  'Max 处于幼年期，已接种基础疫苗，健康状况良好。',
  'Max 是被好心市民在徐汇区附近发现的流浪幼犬，经救助站照料后已完全健康。',
  ARRAY['领养人需有耐心陪伴幼犬', '有稳定居住环境'],
  TRUE, '2小时前添加'
),
(
  'Luna', '国内短毛猫', '1 岁', 12, 'female', 'cat', '小型', '待领养',
  '上海市 浦东新区', '5 英里', 5,
  ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuBSkgRkGpSbJvsZd4Gq7JxEefE1XyIkq5qk0hG-iWD3qWTES9Nxrp1wuShxkzXoHOLY3D9xQ2oB0LTSvevcFaEtBEinePZVrzVxbN4ZEUVHgIyTVj4pVIOg0QI2j_WFZn4nvTiSRKgda5tORGqB8pS2ch8AsKLC7v8OijKRiVHTTGlDxRlrY0nAYOuzmWGkC1VJ4h_V3OlIFSFlORQaNznCDvslasw_jGmPIParEoX-q61QixSJU_FPgIDb2hbYqK5HmrU5bql7G5w'],
  ARRAY['温顺', '独立', '已绝育'],
  'Luna 是一只文静优雅的猫咪，喜欢安静的环境。她不太喜欢吵闹，适合安静的家庭。',
  'Luna 已完成绝育手术，疫苗齐全，身体健康。',
  'Luna 是从一个废弃建筑中被救出的，经过一段时间的适应，她现在已经能够信任人类了。',
  ARRAY['适合安静的居住环境', '最好没有幼童'],
  FALSE, ''
),
(
  'Charlie', '贵宾犬混血', '3 岁', 36, 'male', 'dog', '中型', '待领养',
  '上海市 长宁区', '8 英里', 8,
  ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuBdppusfyGbIVwwFTY8vDwsUhPztgzLOQ3Q1XDieZozLvo7CAG8Fg-v8PzPGHVdpHw78ZhJ3TfMw9xTS3DJ5u1ekx84eT9fsgXEM9olIurd6ZfIf4_xqJfG1NWaBMTtFG7_xu_uk2z-l-Nfvo2Ad23tVcl0qcu69Bi-txWZhIDhtdqHIKTQfyYmYSUzCYw51GvleIMm7rWL55IbQpf9fe9hYGtTDnaiCLdiZ8lwW65HJMJrbM6VqMgJwOlBRGitKXg4RmuNDa4l1qA'],
  ARRAY['温和', '已绝育', '适合家庭'],
  'Charlie 是一只温和友好的狗狗，与小孩和其他宠物相处融洽，是家庭的好伴侣。',
  'Charlie 身体健康，已完成绝育，疫苗接种完整。',
  'Charlie 的原主人因工作变动无法继续饲养，将他托付给了救助站。',
  ARRAY['有庭院或较大居住空间更佳', '能接受定期访问'],
  FALSE, ''
),
(
  'Snowball', '马尔济斯混血', '8个月', 8, 'male', 'dog', '小型', '待领养',
  '上海市 普陀区', '3 英里', 3,
  ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuCNB7YQnmrAraYDHaeu6imNDpBAOeBZ4Dh8t3oLBworrsPwhvHwN7EtA8uJQt7AM67PJK_tRbJhRwD0wilfoBus6yPQmowXivTq1Yyx0gq1fzcRCHli5rDLouBACVAPi3cYvROoSDFxmed_mcTTUsWl9rL3qAnhPdn54KZenr8uZqiYg6GrEwgn8uvGKScB1zt1bG6rEaytHBOG5wreoccX4JUCI7qF3MsyHBIZuUVfcmzQp1qrULM44Lwj-n_fi7EnN_l3z-uL0ic'],
  ARRAY['可爱', '活泼', '亲人'],
  'Snowball 是只超级可爱的小白狗，喜欢撒娇，非常粘人。',
  '已接种基础疫苗，健康活泼。',
  'Snowball 是被好心人从路边捡到的，救助站确认他身体健康后对外发布领养。',
  ARRAY['需要有时间陪伴的家庭'],
  TRUE, '5小时前添加'
),
(
  'Oliver', '家养短毛猫', '2岁', 24, 'male', 'cat', '小型', '待领养',
  '上海市 虹口区', '5 英里', 5,
  ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuBoXryaNGC4TXntUrky7y_p9IjBRvWiGRKgdDPXKCO0mtmn4gXBrEY8lEgEg9eRU5Nb3gdo4dlhoOS5OQAeqS0NZVXBGjNlvNNpodbHzl01RVYTIXJesQjn1gXYXpDjtsIHkLFBpUGFonEgQh-PBBpJi60bcb9OFTHDOCu1CtyRyQblqymede8wRC_rlPm4j2qZL12gLnCfVu5gAjpmvcn0qbOYvBK4KlzZIshDorY-Qs_LAojyxq0cSYLybM9zfm7kM0jQh3q4fXA'],
  ARRAY['好奇', '聪明', '已绝育'],
  'Oliver 是只非常好奇的猫，对周围的一切充满探索欲。他很聪明，会玩玩具。',
  '已完成绝育，疫苗齐全，定期体检。',
  'Oliver 是被原主人放弃在小区的，被志愿者发现后送至救助站。',
  ARRAY['接受有其他宠物的家庭', '定期回访'],
  FALSE, ''
);

-- ============================================================
-- 领养申请表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.adoption_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  pet_name TEXT NOT NULL,
  pet_info TEXT DEFAULT '',
  image TEXT DEFAULT '',
  status TEXT DEFAULT '材料审核',
  status_desc TEXT DEFAULT '您的申请已提交，请耐心等待审核',
  is_active BOOLEAN DEFAULT TRUE,
  applicant_name TEXT DEFAULT '',
  applicant_phone TEXT DEFAULT '',
  living_city TEXT DEFAULT '',
  housing_type TEXT DEFAULT '自有住房',
  has_experience BOOLEAN DEFAULT TRUE,
  adoption_reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户可读取自己的申请" ON public.adoption_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可创建申请" ON public.adoption_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "服务角色可管理所有申请" ON public.adoption_applications FOR ALL USING (true);

-- ============================================================
-- 收藏表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, pet_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户可读取自己的收藏" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可管理自己的收藏" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "服务角色可管理收藏" ON public.favorites FOR ALL USING (true);

-- ============================================================
-- 聊天会话表（每个用户独立的会话状态）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_chat_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,  -- '1', '2', '3', '4' 等静态会话ID
  unread INTEGER DEFAULT 0,
  last_message TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, conversation_id)
);

ALTER TABLE public.user_chat_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户可管理自己的聊天状态" ON public.user_chat_states FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "服务角色可管理聊天状态" ON public.user_chat_states FOR ALL USING (true);

-- ============================================================
-- 触发器：新用户注册时自动创建 users 记录
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
