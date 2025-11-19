import React, { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [q, setQ] = useState('');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(1);

  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search (e.g., Tbilisi)" style={{padding:8, minWidth:260}} />
      <input type="number" value={days} min={1} onChange={(e)=>setDays(Number(e.target.value))} style={{width:72}} />
      <input type="number" value={travelers} min={1} onChange={(e)=>setTravelers(Number(e.target.value))} style={{width:72}} />
      <button onClick={()=>onSearch(q,{days,travelers})} disabled={loading || !q}>
        {loading ? 'Planning…' : 'Plan Trip'}
      </button>
    </div>
  );
}
