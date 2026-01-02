const mongoose = require('mongoose');

// Kullanıcı Şeması
const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Her mailden sadece bir tane olabilir
  },
  password: { 
    type: String, 
    required: true 
  },
  // ÖDEV GEREKSİNİMİ: 3 Farklı Rol [cite: 15]
  role: { 
    type: String, 
    enum: ['student', 'uni_admin', 'super_admin'], 
    default: 'student' 
  },
  // Hangi üniversiteden olduğu (Hacettepe, ODTÜ vb.)
  university: { 
    type: String, 
    default: 'General' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);