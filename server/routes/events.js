const router = require('express').Router();
const Event = require('../models/Event');

// 1. ETKİNLİK OLUŞTUR (CREATE - POST)
// Ödev Şartı: >=1 POST endpoint creating a spatial feature
router.post('/', async (req, res) => {
  const newEvent = new Event(req.body);
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. TÜM ETKİNLİKLERİ GETİR (READ - GET)
// Ödev Şartı: >=1 GET endpoint returning spatial data
router.get('/', async (req, res) => {
  try {
    // Tüm etkinlikleri veritabanından çek
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. ETKİNLİK GÜNCELLE (UPDATE - PUT)
// Ödev Şartı: >=1 PUT/PATCH endpoint updating geometry
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true } // Güncellenmiş veriyi geri döndür
    );
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. ETKİNLİK SİL (DELETE)
// Ödev Şartı: >=1 DELETE endpoint removing a feature
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json("Etkinlik silindi.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;