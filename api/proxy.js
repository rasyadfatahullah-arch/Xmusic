// Proxy Vercel (cadangan jika API diblokir CORS di browser)
const ALLOWED = ['/search/v1/spotify', '/search/lyrics'];

module.exports = async (req, res) => {
  const { path, q } = req.query;
  if (!ALLOWED.includes(path) || !q) {
    return res.status(400).json({ status: false, error: 'Parameter tidak valid' });
  }
  try {
    const r = await fetch(`https://api.nexray.eu.cc${path}?q=${encodeURIComponent(q)}`);
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(502).json({ status: false, error: 'Gagal menghubungi API' });
  }
};
