// TODO: 需要实现完整的登录和会话管理来获取认证头
// 目前仅为匿名调用

export async function postScore(data: { score: number; idempotency_key: string }) {
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${sessionToken}` // TODO: 添加认证
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to post score');
  }

  return response.json();
}

export async function getLeaderboard(limit = 10) {
  const response = await fetch(`/api/leaderboard?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
}

export async function purchaseItem(data: { item_id: string; idempotency_key: string }) {
  const response = await fetch('/api/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${sessionToken}` // TODO: 添加认证
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to purchase item');
  }

  return response.json();
}
