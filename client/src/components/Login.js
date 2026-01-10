import { useState } from "react";
import axios from "axios";
import "./Login.css"; // Birazdan oluşturacağız

export default function Login({ setMyStorage, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'e giriş isteği atıyoruz
      const res = await axios.post("https://gmt458-uni-hue-6pjz.vercel.app/api/users/login", {
        email,
        password,
      });
      
      // Başarılıysa gelen bilgileri (Token, Role, Uni) kaydediyoruz
      // setMyStorage, App.js'den gelecek olan bir fonksiyon
      setMyStorage(res.data); 
      setError(false);
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

return (
    <div className="loginContainer">
      <div className="logo">🗺️ UniHue GIS</div> 
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email (hacettepe.edu.tr vs.)"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
        {error && <span className="failure">Giriş Başarısız!</span>}
        
        <div 
            style={{fontSize: '12px', textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: '#1565c0'}}
            onClick={() => setShowRegister(true)}
        >
            Hesabın yok mu? <b>Kayıt Ol</b>
        </div>
      </form>
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
        © 2025 Rengin Özder — Designed with curiosity and care 🌍
      </div>
    </div>
  );
}