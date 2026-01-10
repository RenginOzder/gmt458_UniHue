import { useState } from "react";
import axios from "axios";
import "./Login.css"; // Aynı CSS dosyasını kullanıyoruz, tasarımı bozmayalım
const API_URL = process.env.REACT_APP_API_URL;

export default function Register({ setShowRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("${API_URL}/api/auth/register", {
        username,
        email,
        password,
      });
      setSuccess(true);
      setError(false);
    } catch (err) {
      setError(true);
      setSuccess(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">📝 Kayıt Ol</div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email (Okul maili veya Gmail)"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Kayıt Ol</button>
        
        {success && (
          <span className="success" style={{color: 'green', textAlign:'center', fontWeight:'bold'}}>
            Başarılı! Şimdi giriş yapabilirsin.
          </span>
        )}
        {error && <span className="failure">Bir hata oluştu!</span>}

        {/* Giriş sayfasına geri dönme butonu */}
        <div 
            style={{fontSize: '12px', textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: '#1565c0'}}
            onClick={() => setShowRegister(false)}
        >
            Zaten hesabın var mı? <b>Giriş Yap</b>
        </div>
      </form>
    </div>
  );
}