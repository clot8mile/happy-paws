-- 快乐爪爪救助站 - 使用占位图测试 (验证是否为域名屏蔽问题)

UPDATE public.pets 
SET images = ARRAY['https://img.js.design/assets/static/f01ac5a2399992d997232e01df72027e?x-oss-process=image/resize,w_500/quality,q_80/format,webp']
WHERE name = 'Luna';

UPDATE public.pets 
SET images = ARRAY['https://img.js.design/assets/static/f01ac5a2399992d997232e01df72027e?x-oss-process=image/resize,w_500/quality,q_80/format,webp']
WHERE name = 'Max';
