import React, { useState } from 'react';
import axios from 'axios';
export default function PhotoUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  async function upload() {
    if (!file) return alert('Pick a file first');
    const form = new FormData(); form.append('photo', file);
    setLoading(true);
    try { const res = await axios.post('http://localhost:4000/api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' }}); onUploaded && onUploaded(res.data); alert('Uploaded'); }
    catch(e){ console.error(e); alert('Upload failed'); }
    setLoading(false);
  }
  return (<div style={{padding:8}}><input type="file" onChange={(e)=>setFile(e.target.files[0])}/><button onClick={upload} disabled={loading || !file}>{loading ? 'Uploading...' : 'Upload Photo'}</button></div>);
}
