const express = require('express');
const router = express.Router();
const shortid = require('shortid');
let REMINDERS = [];

router.post('/', (req,res)=> {
  const id = shortid.generate();
  const r = { id, ...req.body, createdAt: new Date() };
  REMINDERS.push(r);
  res.json(r);
});

router.get('/', (req,res)=> res.json(REMINDERS));

router.delete('/:id', (req,res)=> {
  REMINDERS = REMINDERS.filter(r => r.id !== req.params.id);
  res.json({ success:true });
});

module.exports = router;
