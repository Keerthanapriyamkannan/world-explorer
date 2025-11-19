const express = require('express');
const router = express.Router();
const axios = require('axios');
const { buildItinerary } = require('../utils/itinerary');
const { fetchPOIs } = require('../utils/providers');

router.get('/plan', async (req, res) => {
  try {
    const q = req.query.query;
    const travelers = parseInt(req.query.travelers || '1', 10);
    const days = parseInt(req.query.days || '3', 10);
    if (!q) return res.status(400).json({ error: 'query param required' });

    // Nominatim search forced to English
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&accept-language=en`;
    const nomRes = await axios.get(nomUrl, { headers: { 'User-Agent': 'TripPlanner/1.0 (+your-email)' } });
    if (!nomRes.data || nomRes.data.length === 0) return res.status(404).json({ error: 'Location not found' });
    const place = nomRes.data[0];
    const center = { lat: parseFloat(place.lat), lon: parseFloat(place.lon), display_name: place.display_name };

    const pois = await fetchPOIs(center);
    const itinerary = buildItinerary(center, pois, { days });

    // estimate route distance using haversine
    const flat = itinerary.flatMap(d => d.items);
    let totalMeters = 0;
    for (let i=1;i<flat.length;i++){
      totalMeters += haversine(flat[i-1], flat[i]);
    }
    const totalKm = Math.round((totalMeters/1000)*10)/10;

    const perNight = 4000;
    const perDayFood = 1000;
    const transportPerKm = 15;
    const activityPerPOI = 800;

    const hotelCost = perNight * days;
    const foodCost = perDayFood * days * travelers;
    const transportCost = Math.round(totalKm * transportPerKm);
    const activityCost = activityPerPOI * flat.length;
    const totalBudget = hotelCost + foodCost + transportCost + activityCost;

    res.json({ center, pois, itinerary, totalKm, budget: { hotelCost, foodCost, transportCost, activityCost, totalBudget }, travelers, days });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

function haversine(a,b){ function toRad(d){return d*Math.PI/180;} const R=6371e3; const φ1=toRad(a.lat), φ2=toRad(b.lat); const Δφ=toRad(b.lat-a.lat); const Δλ=toRad(b.lon-a.lon); const x=Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2); const c=2*Math.atan2(Math.sqrt(x), Math.sqrt(1-x)); return R*c; }

module.exports = router;
