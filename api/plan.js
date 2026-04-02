export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method === 'GET') {
    const hasKey = !!process.env.ANTHROPIC_API_KEY;
    return new Response(JSON.stringify({ 
      status: 'ok',
      apiKeyConfigured: hasKey,
      hint: hasKey ? 'Ready! Use POST to plan.' : '⚠️ Add ANTHROPIC_API_KEY in Vercel Settings'
    }), { status: 200, headers });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Use POST' }), { status: 405, headers });
  }

  try {
    const { systemPrompt, userPrompt } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not set' }), { status: 500, headers });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: `Claude error: ${response.status}`, details: err }), { status: response.status, headers });
    }

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');
    return new Response(JSON.stringify({ text }), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}
```

5. 點 **Commit changes** → **Commit changes**

---

### Step 2：建立 `public` 資料夾並移動 `index.html`

1. 點擊 **Add file** → **Create new file**
2. 檔名輸入：`public/index.html`
3. 先貼一個佔位內容：`<!-- placeholder -->`
4. **Commit changes**

5. 現在點進 `public/index.html`
6. 點 ✏️ 編輯
7. 把你**原本根目錄的 `index.html` 內容**全部複製貼上（替換佔位內容）
8. **Commit changes**

---

### Step 3：刪除根目錄的舊檔案

刪除這些不需要的檔案：
- `index.html`（根目錄的）
- `plan.js`（根目錄的）
- `vietnam-hanoi.zip`

方法：點進每個檔案 → 右上角 **⋯** → **Delete file** → **Commit changes**

---

### Step 4：等待 Vercel 自動重新部署

完成後等 30 秒，然後測試：
```
https://hanoiclaude.vercel.app/api/plan
