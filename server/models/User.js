const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // Rolü burada belirliyoruz: 'basic', 'student' veya 'admin'
  role: { 
    type: String, 
    enum: ['basic', 'student', 'admin'], 
    default: 'basic' 
  },
  // Eğer öğrenciyse hangi üniversite? (hacettepe, odtu, gazi vb.)
  // Basic user ise burası 'null' kalacak.
  university: { 
    type: String, 
    default: null 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);