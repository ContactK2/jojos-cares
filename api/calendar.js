export default async function handler(req, res) {
  const SHEET_ID = '1HYO_ixHcD0uXnuEEolVmxpf-KDKReG_bxXGnN4UqJbk';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    const rows = text.trim().split('\n').slice(1);
    const result = rows.map(row => {
      const parts = row.split(',');
      return {
        date:   (parts[0] || '').trim().replace(/"/g, ''),
        status: (parts[1] || '').trim().replace(/"/g, '').toLowerCase()
      };
    }).filter(r => r.date && r.status);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300');
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
}
