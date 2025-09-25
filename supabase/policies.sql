-- 开启 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- 清理旧策略
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Scores are publicly readable" ON public.scores;
DROP POLICY IF EXISTS "Scores can only be inserted by service_role" ON public.scores;
DROP POLICY IF EXISTS "Users can read their own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Purchases can only be inserted by service_role" ON public.purchases;
DROP POLICY IF EXISTS "Items are publicly readable" ON public.items;

-- users 表策略
CREATE POLICY "Users can read their own data" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
FOR UPDATE USING (auth.uid() = id);

-- scores 表策略
CREATE POLICY "Scores are publicly readable" ON public.scores
FOR SELECT USING (true);

CREATE POLICY "Scores can only be inserted by service_role" ON public.scores
FOR INSERT WITH CHECK (false); -- 禁止客户端直接插入，必须通过 Edge Function

-- purchases 表策略
CREATE POLICY "Users can read their own purchases" ON public.purchases
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Purchases can only be inserted by service_role" ON public.purchases
FOR INSERT WITH CHECK (false); -- 禁止客户端直接插入，必须通过 Edge Function

-- items 表策略
CREATE POLICY "Items are publicly readable" ON public.items
FOR SELECT USING (true);

-- idempotency_records 表不应被客户端访问，由 service_role 在后端操作，无需 RLS
