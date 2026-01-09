const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Frontend ile konuşması için gerekli

// 🔥 ROTALARI ÇAĞIRIYORUZ (Resimdeki dosya isimlerine göre)
const authRoute = require("./routes/auth"); 
const eventRoute = require("./routes/events");

const app = express();
dotenv.config();

// Middleware (Ara yazılımlar)
app.use(express.json());
app.use(cors()); // React'tan gelen isteklere izin ver

// 🔌 VERİTABANI BAĞLANTISI
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log(err));

// 🛣️ ROTA YÖNLENDİRMELERİ (ÇOK ÖNEMLİ)
// Giriş ve Kayıt için:
app.use("/api/auth", authRoute);

// Harita Pinleri için:
app.use("/api/events", eventRoute);

// Sunucuyu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📡 MongoDB Bağlantısı Kuruldu ${PORT}!`);
});