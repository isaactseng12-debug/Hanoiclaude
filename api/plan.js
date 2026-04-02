export const config = { runtime: 'edge' };

export default async function handler(req) {
  var headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: headers });
  }

  if (req.method === 'GET') {
    var hasKey = !!process.env.ANTHROPIC_API_KEY;
    return new Response(JSON.stringify({ status: 'ok', apiKeyConfigured: hasKey }), { status: 200, headers: headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Use POST' }), { status: 405, headers: headers });
  }

  try {
    var body = await req.json();
    var apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not set' }), { status: 500, headers: headers });
    }
    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, system: body.systemPrompt, messages: [{ role: 'user', content: body.userPrompt }] })
    });
    if (!res.ok) {
      var errText = await res.text();
      return new Response(JSON.stringify({ error: 'Claude error', details: errText }), { status: res.status, headers: headers });
    }
    var data = await res.json();
    var text = '';
    for (var i = 0; i < data.content.length; i++) { text += data.content[i].text || ''; }
    return new Response(JSON.stringify({ text: text }), { status: 200, headers: headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: headers });
  }
}
