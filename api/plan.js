export const config = { runtime: 'edge' };

export default async function handler(req) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method === 'GET') {
    var hasKey = !!process.env.ANTHROPIC_API_KEY;
    return new Response(JSON.stringify({ status: 'ok', apiKeyConfigured: hasKey }), { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Use POST' }), { status: 405, headers });
  }

  try {
    var body = await req.json();
    var apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not set' }), { status: 500, headers });
    }

    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: body.systemPrompt,
        messages: [{ role: 'user', content: body.userPrompt }]
      })
    });

    if (!res.ok) {
      var errText = await res.text();
      return new Response(JSON.stringify({ error: 'Claude API error', details: e
