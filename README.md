# World Space Shooter

一个基于 Next.js 14 + Phaser 3 的 2D 太空射击游戏，集成了 World App MiniKit 登录验证和 Supabase 后端。

## 🎮 游戏特性

- **2D 太空射击**：经典的飞机射击玩法
- **World ID 登录**：通过 World App MiniKit 进行身份验证
- **排行榜系统**：全球玩家分数排行
- **虚拟道具商店**：使用虚拟金币购买游戏道具
- **响应式设计**：支持桌面和移动设备

## 🛠 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **游戏引擎**: Phaser 3
- **后端**: Supabase (PostgreSQL + RLS + Edge Functions)
- **认证**: World App MiniKit
- **部署**: Vercel + Supabase

## 📁 项目结构

```
world-space-shooter/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── src/
│   ├── game/              # Phaser 游戏代码
│   │   ├── scenes/        # 游戏场景
│   │   ├── systems/       # 游戏系统
│   │   └── services/      # API 服务
│   ├── components/        # React 组件
│   └── lib/               # 工具库
├── public/assets/         # 游戏资源
├── supabase/             # 数据库和 Edge Functions
└── scripts/              # 脚本文件
```

## 🚀 快速开始

### 环境准备

1. **Node.js**: 版本 18 或更高
2. **Supabase 项目**: 需要创建 Supabase 项目
3. **World App 开发者账号**: 需要注册 Worldcoin 开发者账号

### 本地开发

1. **克隆仓库**
   ```bash
   git clone <your-repo-url>
   cd world-space-shooter
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   ```
   
   填入以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: 你的 Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
   - `SUPABASE_SERVICE_KEY`: Supabase service key (仅后端使用)
   - `NEXT_PUBLIC_MINIKIT_APP_ID`: World App MiniKit 应用 ID
   - `MINIKIT_API_KEY`: MiniKit API 密钥 (仅后端使用)

4. **设置数据库**
   
   在 Supabase SQL Editor 中执行：
   ```sql
   -- 执行 supabase/schema.sql 创建表结构
   -- 执行 supabase/policies.sql 设置安全策略
   -- (可选) 执行 scripts/seed.sql 插入测试数据
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   访问 http://localhost:3000

## 🗄️ 数据库架构

### 核心表结构

| 表名 | 描述 | 关键字段 |
|------|------|----------|
| `users` | 用户信息 | `world_id`, `virtual_coins`, `total_score` |
| `scores` | 游戏分数记录 | `user_id`, `score`, `created_at` |
| `items` | 虚拟道具 | `id`, `title`, `price_coins` |
| `purchases` | 购买记录 | `user_id`, `item_id`, `idempotency_key` |
| `idempotency_records` | 幂等性记录 | `idempotency_key`, `expires_at` |

### 安全策略

- **Row Level Security (RLS)**: 所有表都启用了 RLS
- **用户数据隔离**: 用户只能访问自己的数据
- **后端写入**: 分数和购买记录只能通过 Edge Functions 写入
- **幂等性保证**: 所有涉及金币变动的操作都有幂等性保护

## 🔧 API 接口

### 前端 API 路由

- `POST /api/session` - World ID 登录验证
- `GET /api/leaderboard` - 获取排行榜
- `POST /api/score` - 提交游戏分数
- `POST /api/purchase` - 购买虚拟道具
- `GET /api/health` - 健康检查

### Supabase Edge Functions

- `update_score` - 幂等分数更新
- `purchase_item` - 幂等道具购买
- `get_leaderboard` - 排行榜查询

## 🎯 游戏玩法

1. **移动**: 使用鼠标/触摸或 WASD/方向键控制飞船
2. **射击**: 点击屏幕或按空格键射击
3. **得分**: 击中敌人获得分数
4. **生命**: 被敌人撞击或敌人逃脱会失去生命
5. **排行榜**: 游戏结束后分数会提交到全球排行榜

## 🛡️ 安全与合规

### 三大安全原则

1. **禁止提交密钥**: 所有敏感信息通过环境变量管理
2. **仅限虚拟道具**: 不涉及现实货币交易、赌博或提现
3. **后端幂等记账**: 所有余额变动在后端处理，确保数据一致性

### 数据保护

- 所有 API 调用都有输入验证
- 使用 JWT 进行用户认证
- 数据库操作通过 RLS 策略保护
- 幂等性机制防止重复操作

## 🚀 部署指南

### Vercel 部署 (推荐)

1. **连接 GitHub**: 将仓库连接到 Vercel
2. **配置环境变量**: 在 Vercel 项目设置中添加所有环境变量
3. **自动部署**: 推送代码后自动部署

### Supabase Edge Functions 部署

1. **安装 Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **登录并链接项目**
   ```bash
   supabase login
   supabase link --project-ref <your-project-id>
   ```

3. **部署 Edge Functions**
   ```bash
   supabase functions deploy update_score
   supabase functions deploy purchase_item
   supabase functions deploy get_leaderboard
   ```

## 🧪 测试

### 本地测试

```bash
# 运行开发服务器
npm run dev

# 检查类型
npm run lint
```

### 端到端测试流程

1. 启动游戏 ✅
2. 玩一局游戏 ✅  
3. 分数提交到数据库 ✅
4. 排行榜显示更新 ✅
5. (TODO) World ID 登录 🔄
6. (TODO) 虚拟道具购买 🔄

## 📋 开发待办

### M1 里程碑 (基础可玩版本)
- [x] Next.js + Phaser 3 集成
- [x] 基础游戏玩法
- [x] 分数提交和排行榜
- [x] 数据库架构和安全策略
- [ ] 游戏素材替换

### M2 里程碑 (完整功能)
- [ ] World ID 登录集成
- [ ] 虚拟道具购买系统
- [ ] 用户界面优化
- [ ] 音效和视觉效果

### M3 里程碑 (生产就绪)
- [ ] 性能优化
- [ ] 错误处理和监控
- [ ] 完整测试覆盖
- [ ] 生产环境部署

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果遇到问题或需要帮助：

1. 查看 [Issues](../../issues) 页面
2. 创建新的 Issue 描述问题
3. 联系项目维护者

---

**注意**: 这是一个演示项目，仅用于学习和开发目的。在生产环境中使用前，请确保完成所有安全审查和测试。
