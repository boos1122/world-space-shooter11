import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 客户端实例，仅使用 anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型定义
export interface User {
  id: string;
  world_id?: string;
  wallet_address?: string;
  username?: string;
  virtual_coins: number;
  total_score: number;
  games_played: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  description?: string;
  price_coins: number;
  enabled: boolean;
}

export interface Purchase {
  id: string;
  user_id: string;
  item_id: string;
  amount: number;
  coins_delta: number;
  status: string;
  idempotency_key: string;
  created_at: string;
}
