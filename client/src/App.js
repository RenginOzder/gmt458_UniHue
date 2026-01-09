import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UniHueMap from './components/Map';
import './Login.css';

// 🎵 Müzik ve Video dosyalarını import ediyoruz
import backgroundMusic from './comethru.mp4'; 

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  
  // Müzik Referansı
  const audioRef = useRef(new Audio(backgroundMusic));

  // Form Verileri
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");

  // --- BAŞLANGIÇ AYARLARI ---
  useEffect(() => {
    // 1. Müziği Ayarla
    const audio = audioRef.current;
    audio.loop = true; 
    audio.volume = 0.4; 
    audio.currentTime = 10; // 10. saniyeden başla

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const startAudio = () => {
            audio.play();
            document.removeEventListener('click', startAudio);
        };
        document.addEventListener('click', startAudio);
      });
    }

    // 2. Kullanıcı Var mı Kontrol Et
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // --- 🔥 ÇIKIŞ YAPMA FONKSİYONU (GARANTİ) ---
  const handleLogout = () => {
    // 1. Hafızayı temizle
    localStorage.removeItem("user");
    // 2. State'i boşalt
    setCurrentUser(null);
    // 3. Sayfayı zorla yenile (En temiz yöntem)
    window.location.href = "/";
  };

  // --- GİRİŞ / KAYIT FONKSİYONU ---
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post("http://localhost:5000/api/auth/register", {
          username, email, password, university, role: "student"
        });
        alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
        setIsRegister(false);
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username, password
        });
        setCurrentUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error(err);
      alert("Hata! Bilgileri kontrol edin.");
    }
  };

  const handleGuestLogin = () => {
    setCurrentUser({ username: "Misafir", role: "basic", university: null });
  };
  
  // --- EKRAN 1: GİRİŞ YAPILMIŞSA (HARİTA + ÇIKIŞ BUTONU) ---
  if (currentUser) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        
        {/* Harita Bileşeni */}
        {/* DÜZELTME: Çıkış fonksiyonunu (handleLogout) haritaya gönderdik */}
        <UniHueMap currentUser={currentUser} onLogout={handleLogout} />
        
      </div>
    );
  }

  // --- EKRAN 2: GİRİŞ EKRANI ---
  return (
    <div className="login-page">
      <video autoPlay loop muted className="video-bg">
        <source src="https://static.videezy.com/system/resources/previews/000/043/967/original/200128_02_Time-lapse_1080p.mp4" type="video/mp4" />
      </video>

      <div className="intro-section">
        <div className="intro-content">
          <h1>UniHue <span className="highlight">Sanat & Kampüs</span></h1>
          <p className="main-slogan">Ankara'nın ritmi burada atıyor.</p>
          <div className="feature-list">
              <div className="feature-item"><span className="icon">🎭</span><div><h3>Devlet Tiyatroları</h3><p>Opera ve Bale temsilleri.</p></div></div>
              <div className="feature-item"><span className="icon">🎻</span><div><h3>CSO Ada</h3><p>Senfoni Orkestrası.</p></div></div>
              <div className="feature-item"><span className="icon">🎓</span><div><h3>Kampüs</h3><p>Öğrenci etkinlikleri.</p></div></div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="login-card">
          <h2>{isRegister ? "Aramıza Katıl 🚀" : "Giriş Yap 🎫"}</h2>
          <form onSubmit={handleAuth}>
            <div className="input-group">
              <input type="text" placeholder="Kullanıcı Adı" onChange={(e) => setUsername(e.target.value)} required />
            </div>
            {isRegister && (
              <>
                <div className="input-group">
                  <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                  <select onChange={(e) => setUniversity(e.target.value)} required>
                    <option value="">Üniversiteni Seç</option>
                    <option value="hacettepe">Hacettepe</option>
                    <option value="odtu">ODTÜ</option>
                    <option value="ankara">Ankara Üni.</option>
                    <option value="gazi">Gazi</option>
                    <option value="bilkent">Bilkent</option>
                    <option value="atilim">Atılım</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </>
            )}
            <div className="input-group">
              <input type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="action-btn">{isRegister ? "Kayıt Ol" : "Giriş Yap"}</button>
            <p className="toggle-text" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? <>Zaten üye misin? <b>Giriş Yap</b></> : <>Hesabın yok mu? <b>Kayıt Ol</b></>}
            </p>
            {!isRegister && (
               <p className="toggle-text" onClick={handleGuestLogin} style={{marginTop:'10px', fontSize:'12px'}}>
                 👤 <b>Misafir Girişi</b>
               </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;