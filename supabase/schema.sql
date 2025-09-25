-- 1. 用户表
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id VARCHAR(255) UNIQUE,
    wallet_address VARCHAR(255) UNIQUE,
    username VARCHAR(100),
    virtual_coins INT DEFAULT 0 NOT NULL,
    total_score BIGINT DEFAULT 0 NOT NULL,
    games_played INT DEFAULT 0 NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.users IS 'Stores user profile information, linked to World ID.';

-- 2. 分数表
CREATE TABLE IF NOT EXISTS public.scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    score INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.scores IS 'Records scores for each game played by a user.';
CREATE INDEX IF NOT EXISTS scores_user_id_idx ON public.scores(user_id);

-- 3. 道具表
CREATE TABLE IF NOT EXISTS public.items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price_coins INT NOT NULL,
    enabled BOOLEAN DEFAULT true NOT NULL
);
COMMENT ON TABLE public.items IS 'Defines purchasable virtual items.';

-- 4. 购买记录表
CREATE TABLE IF NOT EXISTS public.purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES public.items(id),
    amount INT NOT NULL DEFAULT 1,
    coins_delta INT NOT NULL,
    status TEXT NOT NULL, -- e.g., 'completed', 'failed'
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.purchases IS 'Logs all virtual item purchase transactions.';
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.purchases(user_id);

-- 5. 幂等性记录表
CREATE TABLE IF NOT EXISTS public.idempotency_records (
    idempotency_key TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
COMMENT ON TABLE public.idempotency_records IS 'Ensures operations are processed only once.';

-- 触发器函数：更新用户统计数据
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET
        total_score = total_score + NEW.score,
        games_played = games_played + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 触发器：在插入新分数后更新用户统计
CREATE TRIGGER on_score_insert
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION public.update_user_stats();

-- RPC 函数：获取排行榜
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count INT)
RETURNS TABLE(rank BIGINT, username TEXT, total_score BIGINT, games_played INT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        DENSE_RANK() OVER (ORDER BY u.total_score DESC) as rank,
        u.username,
        u.total_score,
        u.games_played
    FROM public.users u
    ORDER BY u.total_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- RPC 函数：获取用户排名
CREATE OR REPLACE FUNCTION public.get_user_rank(p_user_id uuid)
RETURNS TABLE(rank BIGINT) AS $$
BEGIN
    RETURN QUERY
    WITH ranked_users AS (
        SELECT id, DENSE_RANK() OVER (ORDER BY total_score DESC) as rank
        FROM public.users
    )
    SELECT ru.rank FROM ranked_users ru WHERE ru.id = p_user_id;
END;
$$ LANGUAGE plpgsql;
