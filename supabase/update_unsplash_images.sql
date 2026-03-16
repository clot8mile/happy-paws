-- 快乐爪爪救助站 - 更换宠物图片为 Unsplash (解决 Google 链接在部分地区无法显示的问题)

UPDATE public.pets 
SET images = ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80']
WHERE name = 'Bella';

UPDATE public.pets 
SET images = ARRAY['https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80']
WHERE name = 'Max';

UPDATE public.pets 
SET images = ARRAY['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80']
WHERE name = 'Luna';

UPDATE public.pets 
SET images = ARRAY['https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=800&q=80']
WHERE name = 'Charlie';

UPDATE public.pets 
SET images = ARRAY['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80']
WHERE name = 'Snowball';

UPDATE public.pets 
SET images = ARRAY['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=80']
WHERE name = 'Oliver';
