# Holiday in Hanoi - Vercel 部署指南

## 🚀 快速部署

### 1. 上傳到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vietnam-hanoi.git
git push -u origin main
```

### 2. 連結 Vercel
1. 到 [vercel.com](https://vercel.com) 登入
2. 點選 "Add New Project"
3. 選擇你的 GitHub repo
4. 點選 "Deploy"

### 3. 設定環境變數（重要！）
1. 在 Vercel Dashboard 進入你的專案
2. 點選 "Settings" → "Environment Variables"
3. 新增以下變數：
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-...` (你的 Anthropic API Key)
4. 點選 "Save"
5. 重新部署（點選 "Deployments" → 最新的 deployment → "Redeploy"）

## 📁 專案結構

```
vietnam-hanoi/
├── api/
│   └── plan.js        # Vercel Edge Function - 代理 Claude API
├── public/
│   └── index.html     # 主應用程式
├── vercel.json        # Vercel 路由設定
└── README.md
```

## ✨ 新功能：每日地區指定

在 AI 排行程功能中，你現在可以：
- 為每一天指定主要活動區域
- AI 會優先安排該區域的景點
- 保持同一天內行程的地理連貫性

## 🔑 取得 Anthropic API Key

1. 前往 [console.anthropic.com](https://console.anthropic.com)
2. 登入或註冊帳號
3. 前往 "API Keys" 頁面
4. 點選 "Create Key"
5. 複製 key 並貼到 Vercel 環境變數

## ❓ 常見問題

### Q: 為什麼需要 API route？
直接從瀏覽器呼叫 Anthropic API 會被 CORS 政策擋下來。
透過 Vercel Edge Function 代理請求可以解決這個問題。

### Q: 費用？
- Vercel: 免費方案足夠個人使用
- Anthropic: 依 API 使用量計費（Claude Sonnet 很便宜）

### Q: 安全嗎？
API Key 存在 Vercel 環境變數中，不會暴露在前端程式碼。
