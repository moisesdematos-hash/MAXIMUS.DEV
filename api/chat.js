export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { provider, model, messages, systemPrompt, prompt } = req.body;

  try {
    let response;
    let data;

    if (provider === 'groq') {
      const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' });

      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'openai/gpt-oss-120b',
          messages: systemPrompt ? [{ role: 'system', content: systemPrompt }, ...messages] : messages,
          temperature: 0.7
        })
      });
      data = await response.json();
      return res.status(200).json({ result: data.choices?.[0]?.message?.content || '' });
    }

    if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o',
          messages: systemPrompt ? [{ role: 'system', content: systemPrompt }, ...messages] : messages,
          temperature: 0.7
        })
      });
      data = await response.json();
      return res.status(200).json({ result: data.choices?.[0]?.message?.content || '' });
    }

    return res.status(400).json({ error: 'Unsupported provider' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
