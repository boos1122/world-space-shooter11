// TODO: 这是一个 Edge Function 的示例代码框架
// 需要安装 Deno 和 Supabase CLI 来进行本地测试和部署

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
    const { score, idempotency_key } = await req.json();
    // TODO: 从请求头中获取用户认证信息 (JWT)
    // const authHeader = req.headers.get('Authorization');
    // const user = ...; // 从JWT解析用户信息

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_KEY')!
    );

    // TODO: 实现幂等性检查
    // 1. 检查 idempotency_records 表是否存在 idempotency_key
    const { data: existingRecord } = await supabaseAdmin
      .from('idempotency_records')
      .select('idempotency_key')
      .eq('idempotency_key', idempotency_key)
      .single();

    if (existingRecord) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Operation already processed' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: 开启事务处理
    // 2. 如果不存在，开启事务
    // 3. 插入分数记录
    // 4. 插入幂等记录
    // 5. 提交事务

    // 占位逻辑 - 需要替换为真实的用户ID和事务处理
    console.log(`Received score: ${score} with key: ${idempotency_key}`);
    
    // 假设 user_id 已从认证中获取
    const placeholder_user_id = '00000000-0000-0000-0000-000000000000'; // 替换为真实 user_id
    
    const { data, error } = await supabaseAdmin.from('scores').insert({
        user_id: placeholder_user_id,
        score: score
    }).select();

    if (error) throw error;

    // 插入幂等记录
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24小时后过期

    await supabaseAdmin.from('idempotency_records').insert({
      idempotency_key,
      expires_at: expiresAt.toISOString(),
    });

    return new Response(JSON.stringify({ success: true, data }), {
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
