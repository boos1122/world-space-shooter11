'use client';
// TODO: 此处为UI占位，需要与游戏场景(MainScene)和API服务进行状态同步
// 例如，分数应由MainScene通过事件发射器更新
// 登录状态应由MiniKit服务管理

export default function Hud() {
  return (
    <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center text-lg font-bold">
      <div>Score: <span id="score-display">0</span></div>
      <div>Lives: <span id="lives-display">3</span></div>
      <button 
        id="login-button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with World ID
      </button>
      {/* TODO: 排行榜和购买按钮/弹窗 */}
    </div>
  );
}
