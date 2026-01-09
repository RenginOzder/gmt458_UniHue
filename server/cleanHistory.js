// server/cleanHistory.js
const mongoose = require('mongoose');
const Event = require('./models/Event');
const dotenv = require('dotenv');

dotenv.config();

const cleanExpiredEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("⏳ Akıllı temizlik başlıyor...");

    const now = new Date();

    // SİLME KURALI:
    // 1. Tarihi geçmiş olacak ($lt: now)
    // 2. Tipi, KALICI mekanlardan biri OLMAYACAK ($nin: not in)
    const result = await Event.deleteMany({ 
        date: { $lt: now },
        type: { $nin: ['opera', 'cso', 'cinema', 'theater'] } // 🔥 BUNLARA DOKUNMA!
    });

    if (result.deletedCount > 0) {
      console.log(`✅ Temizlik Tamam: Süresi dolmuş ${result.deletedCount} adet geçici etkinlik silindi.`);
    } else {
      console.log("✨ Silinecek geçici etkinlik bulunamadı. Kalıcı mekanlar güvende.");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("Hata:", err);
  }
};

cleanExpiredEvents();