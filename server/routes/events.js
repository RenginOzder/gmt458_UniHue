const router = require('express').Router();
const Event = require('../models/Event');

// --- ETKİNLİK OLUŞTUR (POST) ---
router.post('/', async (req, res) => {
  const newEvent = new Event(req.body);
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- ETKİNLİKLERİ GETİR (GET) ---
// Mantık: ?university=hacettepe diye sorulursa ona göre getirir.
router.get('/', async (req, res) => {
  try {
    const userUniversity = req.query.university; // URL'den üniversite bilgisini al
    const userRole = req.query.role; // URL'den rol bilgisini al

    let filter = {};

    if (userRole === 'admin') {
      // 1. ADMİN: Her şeyi görür (Filtre yok)
      filter = {}; 
      
    } else if (userUniversity) {
      // 2. ÖĞRENCİ: Hem 'All' (Herkese açık) hem de kendi üniversitesini görür
      filter = { 
        $or: [
          { universityScope: 'All' }, 
          { universityScope: userUniversity }
        ] 
      };

    } else {
      // 3. BASIC USER: Sadece 'All' (Herkese açık) olanları görür
      filter = { universityScope: 'All' };
    }

    const events = await Event.find(filter);
    res.status(200).json(events);

  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE Endpoint: ID'si verilen etkinliği siler
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Etkinlik silindi." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;