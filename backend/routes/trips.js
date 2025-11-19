const express = require('express');
const router = express.Router();
const shortid = require('shortid');
let TRIPS = {};

router.post('/', (req,res) => {
  const id = shortid.generate();
  const trip = { id, ...req.body, createdAt: new Date() };
  TRIPS[id] = trip;
  res.json(trip);
});

router.get('/:id', (req,res)=> {
  const t = TRIPS[req.params.id];
  if (!t) return res.status(404).json({ error:'Not found' });
  res.json(t);
});

module.exports = router;
