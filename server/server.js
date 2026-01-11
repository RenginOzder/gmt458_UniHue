const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const eventRoute = require('./routes/events');


// Uygulamayı Başlat
const app = express();



// Ara Yazılımlar (Middlewares)
app.use(express.json()); // Gelen JSON verilerini okumak için
app.use(cors()); // Frontend ile iletişim için

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoute);


// Test Rotası (API çalışıyor mu?)
app.get('/', (req, res) => {
    res.send('UniHue API: Sunucu ve MongoDB Aktif! 🚀');
});

// MongoDB Bağlantısı (NoSQL Maddesi - %25)
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Bağlantısı Başarılı!');
        // Sunucuyu Dinlemeye Başla
        app.listen(PORT, () => {
            console.log(`📡 Sunucu ${PORT} portunda çalışıyor...`);
        });
      module.exports = app;  
    })
    .catch((err) => {
        console.error('❌ MongoDB Bağlantı Hatası:', err.message);
    });