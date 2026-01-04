import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// İkon Ayarları
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Üniversite İsimleri
const uniNames = {
  hacettepe: "Hacettepe Üniversitesi",
  odtu: "Orta Doğu Teknik Üniversitesi",
  ankara: "Ankara Üniversitesi",
  gazi: "Gazi Üniversitesi",
  atilim: "Atılım Üniversitesi",
  bilkent: "Bilkent Üniversitesi",
  cankaya: "Çankaya Üniversitesi",
  yildirim: "Yıldırım Beyazıt Üni.",
  ufuk: "Ufuk Üniversitesi",
  tobb: "TOBB ETÜ",
  ted: "TED Üniversitesi",
  other: "Diğer Üniversite",
  null: "Misafir Kullanıcı"
};

const UniHueMap = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [newEventLoc, setNewEventLoc] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "study",
    date: ""
  });

  const getEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        params: {
          university: currentUser?.university,
          role: currentUser?.role
        }
      });
      setEvents(res.data);
    } catch (err) {
      console.log("Veri hatası:", err);
    }
  };

  useEffect(() => {
    getEvents();
  }, [currentUser]);

  // Harita Tıklama Bileşeni
  function AddEventClick() {
    useMapEvents({
      click(e) {
        if (currentUser.role === 'basic') {
          // Misafir ise sessiz kal veya uyar
          return;
        }
        setNewEventLoc(e.latlng);
      },
    });
    return newEventLoc ? <Marker position={newEventLoc} /> : null;
  }

  // Form Gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      location: {
        type: "Point",
        coordinates: [newEventLoc.lng, newEventLoc.lat]
      },
      universityScope: currentUser.university,
      creator: currentUser._id
    };

    try {
      await axios.post("http://localhost:5000/api/events", newEvent);
      setNewEventLoc(null);
      setFormData({ title: "", description: "", type: "study", date: "" });
      getEvents();
      alert("Etkinlik Başarıyla Oluşturuldu! 🎉");
    } catch (err) {
      console.log(err);
      alert("Hata oluştu!");
    }
  };

  // İkon Belirleme
  const userIcon = currentUser.role === 'basic' ? "👤" : "🎓";

  // Buton Tıklama Aksiyonu (Rehberlik)
  const handleAddBtnClick = () => {
    alert("📍 Etkinlik eklemek için lütfen harita üzerinde istediğiniz konuma tıklayın.");
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      
      {/* --- SAĞ ÜST PANEL --- */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '15px',
        borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', minWidth: '250px',
        display: 'flex', flexDirection: 'column', gap: '10px' // Elemanlar alt alta düzgün dizilsin
      }}>
        {/* Başlık ve İsim */}
        <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#1a237e' }}>
            👋 Hoşgeldin, <span style={{ textTransform: 'capitalize' }}>{currentUser.username.replace(/_/g, ' ')}</span>
            </h3>
            <p style={{ margin: '0', color: '#546e7a', fontSize: '14px' }}>
            {userIcon} <b>{currentUser.university ? uniNames[currentUser.university] : "Misafir Kullanıcı"}</b>
            </p>
        </div>
        
        {/* İstatistik */}
        <div style={{ fontSize: '12px', color: '#888' }}>
          Şu an haritada <b>{events.length}</b> etkinlik görüntüleniyor.
        </div>

        {/* --- YENİ MAVİ BUTON (SADECE ÖĞRENCİLERE) --- */}
        {currentUser.role !== 'basic' && (
            <button 
                onClick={handleAddBtnClick}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1976d2', // Parlak Mavi
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                }}
            >
                ➕ Etkinlik Ekle
            </button>
        )}
        
        {/* ÇIKIŞ BUTONU */}
        <button 
            onClick={() => window.location.reload()} 
            style={{
                width: '100%', padding: '10px', 
                backgroundColor: '#c62828', // Kırmızı
                color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
            Çıkış Yap 🚪
        </button>
      </div>

      {/* --- SOL ALT: FORM PENCERESİ (Haritaya tıklanınca görünür) --- */}
      {newEventLoc && (
        <div style={{
          position: 'absolute', bottom: '30px', left: '20px', zIndex: 1000,
          backgroundColor: 'white', padding: '20px', borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0,0,0,0.4)', width: '300px'
        }}>
          <h3 style={{marginTop:0, color: '#1565c0'}}>📍 Yeni Etkinlik</h3>
          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <input 
              placeholder="Başlık" required
              onChange={(e)=>setFormData({...formData, title: e.target.value})}
              style={{padding:'8px', border:'1px solid #ccc', borderRadius:'5px'}}
            />
            <textarea 
              placeholder="Açıklama..." required
              onChange={(e)=>setFormData({...formData, description: e.target.value})}
              style={{padding:'8px', border:'1px solid #ccc', borderRadius:'5px'}}
            />
            <select 
              onChange={(e)=>setFormData({...formData, type: e.target.value})}
              style={{padding:'8px', border:'1px solid #ccc', borderRadius:'5px'}}
            >
              <option value="study">📚 Ders Çalışma</option>
              <option value="coffee">☕ Kahve Molası</option>
              <option value="Eating">🌯 Yemek</option>
              <option value="concert">🎵 Konser</option>
              <option value="theater">🎭 Tiyatro</option>
              <option value="other">🚩 Diğer</option>
            </select>
            <input 
              type="datetime-local" required
              onChange={(e)=>setFormData({...formData, date: e.target.value})}
              style={{padding:'8px', border:'1px solid #ccc', borderRadius:'5px'}}
            />
            <div style={{display:'flex', gap:'10px'}}>
              <button type="submit" style={{flex:1, background:'#2e7d32', color:'white', border:'none', padding:'10px', borderRadius:'5px', cursor:'pointer'}}>Kaydet</button>
              <button type="button" onClick={()=>setNewEventLoc(null)} style={{flex:1, background:'#c62828', color:'white', border:'none', padding:'10px', borderRadius:'5px', cursor:'pointer'}}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* HARİTA */}
      <MapContainer center={[39.9334, 32.8597]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AddEventClick />
        {events.map((event) => (
          <Marker key={event._id} position={[event.location.coordinates[1], event.location.coordinates[0]]}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: '#d32f2f', margin: 0 }}>{event.title}</h4>
                <small>{event.type}</small>
                <p>{event.description}</p>
                {event.universityScope !== 'All' && (
                  <span style={{ background: '#e3f2fd', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', color: '#0d47a1' }}>
                    Sadece {uniNames[event.universityScope] || event.universityScope}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default UniHueMap;