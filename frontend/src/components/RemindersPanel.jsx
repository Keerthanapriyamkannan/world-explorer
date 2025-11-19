import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RemindersPanel() {
  const [reminders, setReminders] = useState([]);
  const [text, setText] = useState('');
  const [time, setTime] = useState('');
  useEffect(()=>{ fetchList(); },[]);
  async function fetchList(){ const res = await axios.get('http://localhost:4000/api/reminders'); setReminders(res.data || []); }
  async function add(){ if(!text||!time) return alert('fill text and time'); const res = await axios.post('http://localhost:4000/api/reminders', { text, time }); setReminders(prev=>[res.data, ...prev]); setText(''); setTime(''); }
  async function remove(id){ await axios.delete(`http://localhost:4000/api/reminders/${id}`); fetchList(); }
  return (<div style={{padding:12}}><h4>Reminders</h4><input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Reminder text" /><input type="datetime-local" value={time} onChange={(e)=>setTime(e.target.value)} /><button onClick={add}>Add</button><ul>{reminders.map(r=> <li key={r.id}>{r.text} — {r.time} <button onClick={()=>remove(r.id)}>x</button></li>)}</ul></div>);
}
