import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import MapView from './components/MapView';
import ItineraryPanel from './components/ItineraryPanel';
import PhotoUpload from './components/PhotoUpload';
import RemindersPanel from './components/RemindersPanel';
import CollaborationPanel from './components/CollaborationPanel';

export default function App(){
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query, options = {}) {
    setLoading(true);
    try {
      const url = `http://localhost:4000/api/places/plan?query=${encodeURIComponent(query)}&days=${options.days||3}&travelers=${options.travelers||1}`;
      const res = await fetch(url);
      const data = await res.json();
      setPlan(data);
    } catch (e) {
      console.error(e);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Trip Planner (English Map)</h1>
        <SearchBar onSearch={handleSearch} loading={loading}/>
      </header>

      <div className="layout">
        <div className="map-column">
          <MapView plan={plan} />
        </div>
        <div className="panel-column">
          <ItineraryPanel plan={plan} />
          <PhotoUpload />
          <RemindersPanel />
          <CollaborationPanel />
        </div>
      </div>
    </div>
  );
}
