function toRad(d){ return d*Math.PI/180; }
function haversine(a, b) {
  const R = 6371e3;
  const φ1 = toRad(a.lat), φ2 = toRad(b.lat);
  const Δφ = toRad(b.lat - a.lat), Δλ = toRad(b.lon - a.lon);
  const x = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  return R * c;
}

function buildItinerary(center, pois, opts={ days: 3 }) {
  const days = opts.days || 3;
  const withDist = pois.map(p => ({ ...p, dist: haversine(center, { lat: p.lat, lon: p.lon }) }));
  withDist.sort((a,b) => a.dist - b.dist);
  const perDay = Math.ceil(withDist.length / days) || 1;
  const itinerary = [];
  for (let d = 0; d < days; d++) {
    const items = withDist.slice(d * perDay, (d+1) * perDay);
    itinerary.push({ day: d+1, items: items.map(it => ({ id: it.id, name: it.name, lat: it.lat, lon: it.lon, kind: it.kind })) });
  }
  return itinerary;
}

module.exports = { buildItinerary, haversine };
