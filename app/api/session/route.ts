import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// TODO: 完整实现 World ID 验证和会话交换
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { world_id, wallet_address, proof } = body;

    // TODO: 验证 World ID proof
    // 1. 使用 MiniKit API 验证 proof 的有效性
    // 2. 确保 world_id 和 wallet_address 匹配

    // TODO: 创建或更新用户记录
    // const { data: user, error } = await supabase
    //   .from('users')
    //   .upsert({
    //     world_id,
    //     wallet_address,
    //     is_verified: true,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .select()
    //   .single();

    // TODO: 生成会话令牌
    // const sessionToken = generateJWT(user);

    // 占位响应
    return NextResponse.json({
      success: false,
      message: 'World ID integration not yet implemented',
      // session_token: sessionToken,
      // user: user,
    });

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // TODO: 验证当前会话状态
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'No authorization header' },
      { status: 401 }
    );
  }

  // TODO: 验证 JWT token
  // const token = authHeader.replace('Bearer ', '');
  // const user = verifyJWT(token);

  return NextResponse.json({
    success: false,
    message: 'Session verification not yet implemented',
  });
}
