-- 种子数据：用于本地开发和测试

-- 插入测试用户
INSERT INTO public.users (id, world_id, username, virtual_coins, total_score, games_played, is_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'test_world_id_1', 'Alice', 1000, 15000, 25, true),
('22222222-2222-2222-2222-222222222222', 'test_world_id_2', 'Bob', 800, 12000, 20, true),
('33333333-3333-3333-3333-333333333333', 'test_world_id_3', 'Charlie', 1200, 18000, 30, true),
('44444444-4444-4444-4444-444444444444', 'test_world_id_4', 'Diana', 600, 8000, 15, false),
('55555555-5555-5555-5555-555555555555', 'test_world_id_5', 'Eve', 900, 10000, 18, true)
ON CONFLICT (id) DO NOTHING;

-- 插入测试分数记录
INSERT INTO public.scores (user_id, score) VALUES
('11111111-1111-1111-1111-111111111111', 500),
('11111111-1111-1111-1111-111111111111', 600),
('11111111-1111-1111-1111-111111111111', 700),
('22222222-2222-2222-2222-222222222222', 400),
('22222222-2222-2222-2222-222222222222', 550),
('33333333-3333-3333-3333-333333333333', 800),
('33333333-3333-3333-3333-333333333333', 650),
('44444444-4444-4444-4444-444444444444', 300),
('55555555-5555-5555-5555-555555555555', 450);

-- 插入虚拟道具
INSERT INTO public.items (id, title, description, price_coins, enabled) VALUES
('extra_life', 'Extra Life', 'Gain an additional life for the current game', 100, true),
('double_score', 'Double Score', 'Double your score for the next 30 seconds', 200, true),
('rapid_fire', 'Rapid Fire', 'Increase firing rate for 60 seconds', 150, true),
('shield', 'Energy Shield', 'Temporary invincibility for 10 seconds', 300, true),
('coin_pack_small', 'Small Coin Pack', 'Receive 500 virtual coins', 0, true),
('coin_pack_large', 'Large Coin Pack', 'Receive 2000 virtual coins', 0, false)
ON CONFLICT (id) DO NOTHING;

-- 插入测试购买记录
INSERT INTO public.purchases (user_id, item_id, amount, coins_delta, status, idempotency_key) VALUES
('11111111-1111-1111-1111-111111111111', 'extra_life', 1, -100, 'completed', 'test_purchase_1'),
('22222222-2222-2222-2222-222222222222', 'double_score', 1, -200, 'completed', 'test_purchase_2'),
('33333333-3333-3333-3333-333333333333', 'rapid_fire', 2, -300, 'completed', 'test_purchase_3')
ON CONFLICT (idempotency_key) DO NOTHING;
