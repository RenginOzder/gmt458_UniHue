import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios'; // Haberciyi çağırdık

// İkon düzeltmesi
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const UniHueMap = () => {
  const [events, setEvents] = useState([]); // Etkinlikleri tutacak sepetimiz

  // Sayfa yüklendiğinde çalışacak kısım
  useEffect(() => {
    const getEvents = async () => {
      try {
        // Backend'e istek atıyoruz
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data); // Gelen verileri sepete koy
        console.log("Veriler geldi:", res.data); // Konsola yazdır (kontrol için)
      } catch (err) {
        console.log("Veri çekme hatası:", err);
      }
    };
    getEvents();
  }, []);

  return (
    <MapContainer 
      center={[39.9334, 32.8597]} 
      zoom={12} 
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Sepetteki her etkinlik için bir Marker (Pin) oluştur */}
      {events.map((event) => (
        <Marker 
          key={event._id}
          // DİKKAT: MongoDB [Boylam, Enlem] tutar, Leaflet [Enlem, Boylam] ister. Ters çeviriyoruz!
          position={[event.location.coordinates[1], event.location.coordinates[0]]}
        >
          <Popup>
            <b>{event.title}</b> <br />
            Tür: {event.type} <br />
            {event.description}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
};

export default UniHueMap;