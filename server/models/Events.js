const mongoose = require('mongoose');

// Etkinlik Şeması
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { 
    type: String, 
    enum: ['theater', 'cinema', 'concert', 'coffee', 'other'],
    required: true
  },
  date: { type: Date, required: true },
  
  // MEKANSAL VERİ (GeoJSON Point) - [cite: 21]
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Boylam, Enlem] formatında
      required: true
    }
  },
  
  // Hangi kullanıcı oluşturdu?
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  universityScope: { type: String, default: 'All' } // 'Hacettepe', 'All' vb.
});

// Performans için Mekansal İndeksleme (Spatial Indexing) - [cite: 18]
// Bu satır sorguları hızlandırır ve performans testi maddesi için kritiktir.
EventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', EventSchema);