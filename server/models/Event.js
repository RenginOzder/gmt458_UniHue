const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { 
    type: String, 
    // Senin örneğindeki 'ders çalışma'yı da ekledim ('study')
    enum: ['theater', 'cinema', 'concert', 'coffee', 'study', 'other'],
    required: true
  },
  date: { type: Date, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Boylam, Enlem]
      required: true
    }
  },
  // YENİ: Etkinliğin kapsamı. 'All' ise Ankara geneli, yoksa üniversite adı.
  universityScope: { 
    type: String, 
    default: 'All' 
  },
  // YENİ: Etkinliği oluşturan kişinin ID'si
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Coğrafi sorgular için indeks
EventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', EventSchema);