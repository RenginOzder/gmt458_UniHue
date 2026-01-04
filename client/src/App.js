import React, { useState } from "react";
import "./App.css";
import UniHueMap from "./components/Map";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false); // Kayıt sayfasını açıp kapatan anahtar

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  // 1. Kullanıcı Giriş Yapmışsa -> HARİTA
  if (currentUser) {
    return <UniHueMap currentUser={currentUser} />;
  }

  // 2. Kayıt Ol butonuna basılmışsa -> REGISTER SAYFASI
  if (showRegister) {
    return <Register setShowRegister={setShowRegister} />;
  }

  // 3. Hiçbiri değilse -> LOGIN SAYFASI
  return <Login setMyStorage={handleLogin} setShowRegister={setShowRegister} />;
}

export default App;