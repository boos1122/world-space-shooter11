import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { item_id, idempotency_key } = body;

    // 验证输入
    if (!item_id || typeof item_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid item_id' },
        { status: 400 }
      );
    }

    if (!idempotency_key || typeof idempotency_key !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid idempotency_key' },
        { status: 400 }
      );
    }

    // TODO: 验证用户认证
    // const authHeader = request.headers.get('Authorization');
    // const user = verifyJWT(authHeader);

    // TODO: 调用 Supabase Edge Function 进行幂等购买
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      throw new Error('Missing Supabase configuration');
    }

    // 调用 Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/purchase_item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        item_id,
        idempotency_key,
        // user_id: user.id, // TODO: 从认证中获取
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Edge function call failed');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
