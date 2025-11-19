const axios = require('axios');
const ORS_KEY = process.env.ORS_API_KEY;

async function fetchPOIs(center) {
  const radius = 5000;
  if (ORS_KEY) {
    try {
      const url = 'https://api.openrouteservice.org/pois';
      const body = { request:'pois', geometry:{ bbox:[[center.lon-0.1,center.lat-0.1],[center.lon+0.1,center.lat+0.1]] }, limit:30 };
      const rs = await axios.post(url, body, { headers: { 'Authorization': ORS_KEY } });
      const pois = (rs.data?.features || []).map(f => ({ id:f.id, name:f.properties?.name||'POI', lat:f.geometry.coordinates[1], lon:f.geometry.coordinates[0], kind:f.properties?.category||'poi', source:'ORS' }));
      if (pois.length) return pois;
    } catch(e){ console.warn('ORS failed', e.message); }
  }
  try {
    const query = `[out:json][timeout:25];( node(around:${radius},${center.lat},${center.lon})[tourism]; node(around:${radius},${center.lat},${center.lon})[amenity=restaurant]; node(around:${radius},${center.lat},${center.lon})[historic]; ); out center 30;`;
    const rs = await axios.post('https://overpass-api.de/api/interpreter', query, { headers: { 'Content-Type': 'text/plain' } });
    const elements = rs.data?.elements || [];
    return elements.map(e => ({
      id: e.id,
      name: e.tags?.['name:en'] || e.tags?.name || e.tags?.tourism || 'POI',
      lat: e.lat,
      lon: e.lon,
      kind: e.tags?.tourism || e.tags?.historic || e.tags?.amenity || 'poi',
      source: 'Overpass'
    }));
  } catch(e) { console.warn('Overpass failed', e.message); }
  return [
    { id:'m1', name:`${center.display_name} Museum`, lat:center.lat+0.01, lon:center.lon+0.01, kind:'museum', source:'mock' },
    { id:'m2', name:`${center.display_name} Park`, lat:center.lat-0.01, lon:center.lon-0.01, kind:'park', source:'mock' },
    { id:'m3', name:`${center.display_name} Main Square`, lat:center.lat+0.015, lon:center.lon-0.01, kind:'square', source:'mock' }
  ];
}

module.exports = { fetchPOIs };
