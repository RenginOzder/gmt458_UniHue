import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// --- İKON OLUŞTURUCU ---
const createColorIcon = (color, size = 40) => {
  const svgIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="black" stroke-width="1" stroke-linejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    <circle cx="12" cy="9" r="2.5" fill="white"/>
  </svg>`;
  return L.divIcon({
    className: 'custom-icon',
    html: svgIcon,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size + 5]
  });
};

// --- RENK VE İKON AYARLARI ---
const ICONS = {
  cinema: createColorIcon('#9c27b0'),    // 🟣 Sinema
  opera: createColorIcon('#e91e63'),     // 🌸 Opera
  cso: createColorIcon('#1a237e'),       // 🔵 CSO
  theater: createColorIcon('#ff9800'),   // 🟠 Tiyatro
  concert: createColorIcon('#f44336'),   // 🎵 Bahar Şenliği
  eat: createColorIcon('#4caf50'),       // 🌯 Yemek
  coffee: createColorIcon('#795548'),    // ☕ Kahve
  study: createColorIcon('#607d8b'),     // 📚 Ders
  student: createColorIcon('#d32f2f')    // ❤️ Varsayılan
};

const uniNames = {
  hacettepe: "Hacettepe Üniversitesi", odtu: "ODTÜ", ankara: "Ankara Üniversitesi",
  gazi: "Gazi Üniversitesi", atilim: "Atılım", bilkent: "Bilkent", other: "Diğer", null: "Misafir"
};

const UNI_COORDS = {
  odtu: [39.8914, 32.7847],
  hacettepe: [39.8656, 32.7344],
  bilkent: [39.8679, 32.7488],
  ankara: [39.9365, 32.8306],
  gazi: [39.9378, 32.8214],
  default: [39.9208, 32.8541] 
};

// --- OTOMATİK ZOOM ---
function FlyToUniversity({ university }) {
  const map = useMap();
  useEffect(() => {
    if (university && UNI_COORDS[university]) {
      map.flyTo(UNI_COORDS[university], 15, { duration: 2 });
    } else {
      map.flyTo(UNI_COORDS.default, 12, { duration: 2 });
    }
  }, [university, map]);
  return null;
}

const UniHueMap = ({ currentUser, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [newEventLoc, setNewEventLoc] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", type: "study", date: "" });

  const getEvents = useCallback(async () => {
    try {
      const res = await axios.get("https://gmt458-uni-hue.vercel.app/api/events", {
        params: { university: currentUser?.university, role: currentUser?.role }
      });
      setEvents(res.data);
    } catch (err) { console.log("Veri hatası:", err); }
  }, [currentUser]);

  useEffect(() => { getEvents(); }, [getEvents]);

  // Haritaya Tıklama
  function AddEventClick() {
    useMapEvents({
      click(e) {
        if (currentUser.role === 'basic') return; 
        setNewEventLoc(e.latlng);
      },
    });
    return newEventLoc ? <Marker position={newEventLoc} icon={ICONS.student} /> : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      location: { type: "Point", coordinates: [newEventLoc.lng, newEventLoc.lat] },
      universityScope: currentUser.university,
      creator: currentUser._id
    };
    try {
      await axios.post("https://gmt458-uni-hue.vercel.app/api/events", newEvent);
      setNewEventLoc(null);
      setFormData({ title: "", description: "", type: "study", date: "" });
      getEvents();
      alert("Etkinlik Eklendi!");
    } catch (err) { alert("Hata!"); }
  };

  const getMarkerIconForEvent = (event) => {
    if (ICONS[event.type]) return ICONS[event.type];
    return ICONS.student;
  };

  const translateType = (type) => {
    if (type === 'cinema') return '🎬 Sinema';
    if (type === 'theater') return '🎭 Tiyatro';
    if (type === 'study') return '📚 Ders Çalışma';
    if (type === 'coffee') return '☕ Çay/Kahve Molası';
    if (type === 'eat') return '🌯 Yemek';
    if (type === 'concert') return '🎵 Bahar Şenliği / Konser';
    if (type === 'opera') return '💃 Opera ve Bale';
    if (type === 'cso') return '🎻 CSO Konser';
    return '📅 Etkinlik';
  };

  const userIcon = currentUser.role === 'basic' ? "👤" : "🎓";
  const handleAddBtnClick = (e) => { 
      e.stopPropagation(); // Butona basınca haritaya basmayı engelle
      alert("📍 Harita üzerinde eklemek istediğiniz yere tıklayın."); 
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      
      {/* 🟢 KULLANICI PROFİL KARTI */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '15px',
        borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', minWidth: '250px',
        display: 'flex', flexDirection: 'column', gap: '10px'
      }}
      // Karta tıklayınca da haritaya tıklamayı engellemek için:
      onClick={(e) => e.stopPropagation()} 
      onDoubleClick={(e) => e.stopPropagation()}
      >
        <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#1a237e' }}>
            👋 <span style={{ textTransform: 'capitalize' }}>{currentUser.username}</span>
            </h3>
            <p style={{ margin: '0', color: '#546e7a', fontSize: '14px' }}>
            {userIcon} <b>{currentUser.university ? uniNames[currentUser.university] : "Misafir Kullanıcı"}</b>
            </p>
        </div>
        
        {/* AKTİF ETKİNLİK SAYISI */}
        <div style={{ fontSize: '12px', color: '#888' }}>
          Görünen Etkinlik: <b>{
            events.filter(event => {
                const permanentTypes = ['opera', 'cso', 'cinema', 'theater'];
                if (permanentTypes.includes(event.type)) return true;
                return new Date(event.date) >= new Date();
            }).length
          }</b>
        </div>

        {currentUser.role !== 'basic' && (
            <button onClick={handleAddBtnClick} style={{
                width: '100%', padding: '8px', backgroundColor: '#1976d2', color: 'white',
                border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
            }}>➕ Etkinlik Ekle</button>
        )}
        
        {/* ÇIKIŞ BUTONU */}
        <button 
            onClick={(e) => {
                e.stopPropagation(); // Haritaya tıklamayı engelle (ZOOM SORUNUNU ÇÖZER)
                if(onLogout) onLogout(); // App.js'den gelen çıkışı yap
                else window.location.reload(); 
            }} 
            style={{
                width: '100%', padding: '8px', backgroundColor: '#c62828', color: 'white',
                border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
            }}
        >
            Çıkış Yap 🚪
        </button>
        {/* Kategori Renkleri*/}
        <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555' }}>🏛️🎀 Mekan Rehberi</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#444' }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#9c27b0', borderRadius: '50%', marginRight: '8px' }}></span>
                    Sinema
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#ff9800', borderRadius: '50%', marginRight: '8px' }}></span>
                    Tiyatro
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#e91e63', borderRadius: '50%', marginRight: '8px' }}></span>
                    Bale (Opera)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#1a237e', borderRadius: '50%', marginRight: '8px' }}></span>
                    CSO
                </li>
            </ul>
        </div>

      </div>

      {/* --- ETKİNLİK EKLEME FORMU --- */}
      {newEventLoc && (
        <div 
            style={{
            position: 'absolute', bottom: '40px', left: '20px', zIndex: 1000,
            backgroundColor: 'white', padding: '25px', borderRadius: '15px', width: '320px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border:'1px solid #eee'
            }}
            onClick={(e) => e.stopPropagation()} // Form tıklaması haritaya geçmesin
        >
          <h3 style={{marginTop:0, color: '#1976d2', textAlign:'center'}}>📍 Etkinlik Oluştur</h3>
          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            <input placeholder="Etkinlik Başlığı" required 
              onChange={(e)=>setFormData({...formData, title: e.target.value})} 
              style={{padding:'10px', border:'1px solid #ddd', borderRadius:'8px'}} />
            
            <textarea placeholder="Detaylar..." required rows="2"
              onChange={(e)=>setFormData({...formData, description: e.target.value})} 
              style={{padding:'10px', border:'1px solid #ddd', borderRadius:'8px', resize:'none'}} />
            
            <select onChange={(e)=>setFormData({...formData, type: e.target.value})}
              style={{padding:'10px', border:'1px solid #ddd', borderRadius:'8px', backgroundColor:'white'}}>
               <option value="study">📚 Ders Çalışma</option>
               <option value="coffee">☕ Çay/Kahve Molası</option>
               <option value="eat">🌯 Yemek</option>
               <option value="concert">🎵 Bahar Şenliği</option>
               <option value="theater">🎭 Tiyatro</option>
               <option value="cinema">🎬 Sinema</option>
               <option value="opera">💃 Opera ve Bale</option>
               <option value="cso">🎻 CSO Konser</option>
            </select>
            
            <input type="datetime-local" required 
              onChange={(e)=>setFormData({...formData, date: e.target.value})} 
              style={{padding:'10px', border:'1px solid #ddd', borderRadius:'8px'}} />

            <div style={{display:'flex', gap:'10px'}}>
              <button type="submit" style={{flex:1, background:'#4caf50', color:'white', border:'none', padding:'10px', borderRadius:'8px', cursor:'pointer'}}>Kaydet</button>
              <button type="button" onClick={()=>setNewEventLoc(null)} style={{flex:1, background:'#f44336', color:'white', border:'none', padding:'10px', borderRadius:'8px', cursor:'pointer'}}>Vazgeç</button>
            </div>
          </form>
        </div>
      )}

      {/* --- HARİTA --- */}
      <MapContainer center={[39.9208, 32.8541]} zoom={12} style={{ height: "100%", width: "100%" }}>
        <FlyToUniversity university={currentUser.university} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddEventClick />

        {/* 🔥 AKILLI FİLTRE BURADA: 
            - KALICI BİNALAR (Opera, CSO, Sinema, Tiyatro) -> Hep Göster
            - ÜNİVERSİTE ETKİNLİKLERİ -> Tarihi Geçmemişse Göster
        */}
        {events
          .filter(event => {
              // 1. Kalıcı Mekanlar Listesi
              const permanentTypes = ['opera', 'cso', 'cinema', 'theater'];
              
              // Eğer bu tiplerden biriyse, tarihi ne olursa olsun göster
              if (permanentTypes.includes(event.type)) {
                  return true; 
              }
              
              // 2. Diğerleri (Öğrenci etkinlikleri) için tarih kontrolü yap
              return new Date(event.date) >= new Date();
          }) 
          .map((event) => (
            <Marker 
              key={event._id} 
              position={[event.location.coordinates[1], event.location.coordinates[0]]}
              icon={getMarkerIconForEvent(event)}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '220px' }}>
                  <h4 style={{ color: 'rgba(85, 83, 83, 1)', margin: '0 0 5px 0' }}>{event.title}</h4>
                  <div style={{ 
                      backgroundColor: '#f5f5f5', padding:'6px', borderRadius:'6px', 
                      fontSize:'12px', fontWeight:'bold', marginBottom:'10px', color:'rgba(85, 83, 83, 1)', border:'1px solid #ddd'
                  }}>
                      {translateType(event.type)}
                  </div>
                  {(() => {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const links = event.description.match(urlRegex);
                    const cleanDesc = event.description.replace(urlRegex, '').trim();
                    const targetLink = links ? links[0] : null;
                    return (
                      <>
                        {cleanDesc && <p style={{fontSize:'13px', margin:'5px 0', color:'#555'}}>{cleanDesc}</p>}
                        {targetLink && (
                          <a href={targetLink} target="_blank" rel="noopener noreferrer" style={{
                            display: 'block', margin: '10px auto 0 auto', padding: '10px',
                            backgroundColor: '#2196f3', color: 'white', textDecoration: 'none',
                            borderRadius: '6px', fontWeight: 'bold', fontSize: '13px'
                          }}>
                            🎟️ BİLET / DETAY ➤
                          </a>
                        )}
                      </>
                    );
                  })()}
                  {event.universityScope !== 'All' && (
                    <div style={{marginTop:'8px', fontSize:'11px', color:'#d32f2f', fontWeight:'bold'}}>
                      📍 Sadece {uniNames[event.universityScope]}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
        ))}
      </MapContainer>
      <div style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
        padding: '8px 0',
        zIndex: 999, // Haritanın ve diğer öğelerin üstünde kalması için
        fontSize: '12px',
        color: '#555',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Okunabilirlik için yarı saydam arka plan
        fontFamily: 'sans-serif',
        backdropFilter: 'blur(2px)' // Hafif buzlu cam efekti
      }}>
        © 2026 Rengin Özder — Designed with curiosity and care 🌍
      </div>
    </div>
  );
};

export default UniHueMap;