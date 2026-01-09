const mongoose = require('mongoose');
const Event = require('./models/Event'); // Model dosyanın yeri
const dotenv = require('dotenv');

dotenv.config();

const deleteSpecificEvent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Veritabanına bağlanıldı...");

    // SİLMEK İSTEDİĞİN ETKİNLİĞİN ADINI BURAYA YAZ 👇
    // Regex kullanımı (/isim/i) büyük-küçük harf hatasını önler.
    const targetName = "Bölüm Kahvaltısı"; 

    const result = await Event.deleteOne({ 
        title: { $regex: new RegExp(targetName, "i") } 
    });

    if (result.deletedCount > 0) {
      console.log(`✅ '${targetName}' başarıyla silindi!`);
    } else {
      console.log(`⚠️ '${targetName}' bulunamadı. Zaten silinmiş olabilir.`);
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("Hata:", err);
  }
};

deleteSpecificEvent();