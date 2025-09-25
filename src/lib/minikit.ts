// TODO: World App MiniKit 集成
// 这个文件需要在获得 MiniKit SDK 和 API 密钥后完成实现

export interface WorldIDUser {
  world_id: string;
  wallet_address?: string;
  verified: boolean;
}

export interface SessionToken {
  token: string;
  expires_at: string;
  user: WorldIDUser;
}

// TODO: 初始化 MiniKit
export function initMiniKit() {
  if (typeof window === 'undefined') return;
  
  // MiniKit 初始化逻辑
  console.log('MiniKit initialization placeholder');
  
  // 示例：
  // import { MiniKit } from '@worldcoin/minikit-js';
  // MiniKit.install(process.env.NEXT_PUBLIC_MINIKIT_APP_ID);
}

// TODO: 登录流程
export async function loginWithWorldID(): Promise<SessionToken | null> {
  try {
    // 1. 调用 MiniKit 进行 World ID 验证
    // 2. 获取用户的 world_id 和钱包地址
    // 3. 调用后端 /api/session 交换会话令牌
    
    console.log('World ID login placeholder');
    
    // 占位返回
    return null;
  } catch (error) {
    console.error('World ID login failed:', error);
    return null;
  }
}

// TODO: 登出
export function logout() {
  // 清除本地存储的会话信息
  if (typeof window !== 'undefined') {
    localStorage.removeItem('world-session-token');
  }
}

// TODO: 获取当前会话
export function getCurrentSession(): SessionToken | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('world-session-token');
    if (stored) {
      const session = JSON.parse(stored);
      // 检查是否过期
      if (new Date(session.expires_at) > new Date()) {
        return session;
      } else {
        // 过期则清除
        localStorage.removeItem('world-session-token');
      }
    }
  } catch (error) {
    console.warn('Failed to parse session token:', error);
  }
  
  return null;
}

// TODO: 保存会话
export function saveSession(session: SessionToken) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('world-session-token', JSON.stringify(session));
  } catch (error) {
    console.warn('Failed to save session token:', error);
  }
}
