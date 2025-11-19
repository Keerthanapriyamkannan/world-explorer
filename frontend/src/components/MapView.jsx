import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function Routing({ waypoints }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (map._routingControl) {
      map.removeControl(map._routingControl);
      map._routingControl = null;
    }
    if (!waypoints || waypoints.length < 2) return;
    const control = L.Routing.control({
      waypoints: waypoints.map(p => L.latLng(p.lat, p.lon)),
      routeWhileDragging: false,
      showAlternatives: false,
      lineOptions: { addWaypoints: false, styles: [{ color: '#1976d2', weight: 5 }] },
      router: L.Routing.osrmv1({ language: 'en' })
    }).addTo(map);
    map._routingControl = control;
    return () => {
      if (map._routingControl) {
        map.removeControl(map._routingControl);
        map._routingControl = null;
      }
    };
  }, [map, waypoints]);
  return null;
}

export default function MapView({ plan }) {
  const center = plan?.center ? [plan.center.lat, plan.center.lon] : [41.7151,44.8271];
  const pois = plan?.pois || [];

  const MAPTILER_KEY = window.MAPTILER_KEY || '';

  return (
    <MapContainer center={center} zoom={plan ? 13 : 12} style={{height:'85vh', width:'100%'}}>
      <TileLayer
        url={ MAPTILER_KEY ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}` : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }
        attribution="&copy; MapTiler & OpenStreetMap contributors"
      />
      {plan?.center && <Marker position={[plan.center.lat, plan.center.lon]}><Popup>{plan.center.display_name}</Popup></Marker>}
      {pois.map(p => (<Marker key={p.id} position={[p.lat, p.lon]}><Popup><strong>{p.name}</strong><br/>{p.kind}</Popup></Marker>))}
      <Routing waypoints={pois} />
    </MapContainer>
  );
}
