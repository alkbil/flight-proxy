export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS headers para permitir llamadas desde cualquier origen
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('api_key');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Falta api_key' }), {
      status: 400, headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }

  // Reenviar todos los parámetros a SerpApi
  const serpParams = new URLSearchParams(searchParams);
  const serpUrl = `https://serpapi.com/search.json?${serpParams.toString()}`;

  try {
    const res = await fetch(serpUrl);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }
}
