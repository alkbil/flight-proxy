export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get('api_key');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Falta api_key' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const serpUrl = `https://serpapi.com/search.json?${searchParams.toString()}`;
    
    const serpRes = await fetch(serpUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const data = await serpRes.json();

    return new Response(JSON.stringify(data), {
      status: serpRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export const config = { runtime: 'edge' };