import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { item_id, idempotency_key } = await req.json();
    // TODO: 从请求头中获取用户认证信息 (JWT)
    // const authHeader = req.headers.get('Authorization');
    // const user = ...; // 从JWT解析用户信息

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_KEY')!
    );

    // 检查幂等性
    const { data: existingPurchase } = await supabaseAdmin
      .from('purchases')
      .select('id, status')
      .eq('idempotency_key', idempotency_key)
      .single();

    if (existingPurchase) {
      return new Response(JSON.stringify({ 
        success: existingPurchase.status === 'completed',
        message: 'Purchase already processed',
        purchase: existingPurchase
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 获取道具信息
    const { data: item, error: itemError } = await supabaseAdmin
      .from('items')
      .select('*')
      .eq('id', item_id)
      .eq('enabled', true)
      .single();

    if (itemError || !item) {
      return new Response(JSON.stringify({ error: 'Item not found or disabled' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: 获取用户信息并检查余额
    // const { data: user, error: userError } = await supabaseAdmin
    //   .from('users')
    //   .select('virtual_coins')
    //   .eq('id', user_id)
    //   .single();

    // if (userError || !user) {
    //   return new Response(JSON.stringify({ error: 'User not found' }), {
    //     status: 404,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    // if (user.virtual_coins < item.price_coins) {
    //   return new Response(JSON.stringify({ error: 'Insufficient coins' }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    // TODO: 开启事务处理
    // 1. 扣除用户虚拟币
    // 2. 记录购买
    // 3. 提交事务

    // 占位逻辑
    console.log(`Purchase request: item_id=${item_id}, key=${idempotency_key}`);
    
    const placeholder_user_id = '00000000-0000-0000-0000-000000000000'; // 替换为真实 user_id
    
    // 记录购买（占位）
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: placeholder_user_id,
        item_id: item_id,
        amount: 1,
        coins_delta: -item.price_coins,
        status: 'completed',
        idempotency_key: idempotency_key,
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    return new Response(JSON.stringify({ 
      success: true, 
      purchase,
      message: 'Purchase completed successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
