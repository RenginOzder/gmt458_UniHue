const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { 
    type: String, 
    enum: ['theater', 'cinema', 'concert', 'coffee', 'other'],
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
  universityScope: { type: String, default: 'All' },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

EventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', EventSchema);