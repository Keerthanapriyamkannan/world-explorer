import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
export default function CollaborationPanel() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  useEffect(()=> { const s = io('http://localhost:4000'); setSocket(s); s.on('trip-update', data=> setMessages(m=> [JSON.stringify(data), ...m].slice(0,50))); return ()=> s.disconnect(); },[]);
  function send(){ if(!socket) return; const payload={ text, time: new Date() }; socket.emit('trip-update', payload); setMessages(m=>[JSON.stringify(payload), ...m]); setText(''); }
  return (<div style={{padding:12}}><h4>Collaboration</h4><input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Update message" style={{width:'80%'}}/><button onClick={send}>Send</button><div style={{maxHeight:160, overflow:'auto', marginTop:8}}>{messages.map((m,i)=><div key={i} style={{fontSize:12, borderBottom:'1px solid #eee', padding:'6px 0'}}>{m}</div>)}</div></div>);
}
