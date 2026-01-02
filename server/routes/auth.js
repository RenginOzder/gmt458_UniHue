const router = require('express').Router();
const User = require('../models/User');

// KAYIT OLMA (REGISTER)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email ile zaten kayıt olunmuş!" });
    }

    // 2. Email uzantısına göre Üniversiteyi Bul (PROJE ÖZEL MANTIĞI)
    let determinedUniversity = 'General';
    const emailDomain = email.split('@')[1]; // email'i @ işaretinden böl ve sonrasını al

    if (emailDomain.includes('hacettepe.edu.tr')) {
        determinedUniversity = 'Hacettepe University';
    } else if (emailDomain.includes('metu.edu.tr') || emailDomain.includes('odtu.edu.tr')) {
        determinedUniversity = 'Middle East Technical University';
    } else if (emailDomain.includes('ankara.edu.tr')) {
        determinedUniversity = 'Ankara University';
    } else if (emailDomain.includes('gazi.edu.tr')) {
        determinedUniversity = 'Gazi University';
    }

    // 3. Yeni Kullanıcıyı Oluştur
    const newUser = new User({
      username,
      email,
      password, // Not: Gerçek projede şifre kriptolanmalı (bcrypt), şimdilik düz kaydediyoruz.
      university: determinedUniversity,
      role: 'student' // Varsayılan olarak herkes öğrenci başlar
    });

    // 4. Veritabanına Kaydet
    const savedUser = await newUser.save();

    res.status(201).json({
        message: "Kullanıcı başarıyla oluşturuldu!",
        user: savedUser
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// GİRİŞ YAPMA (LOGIN) - Basit versiyon
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        // Şifre kontrolü (Basit)
        if (user.password !== req.body.password) {
            return res.status(400).json({ message: "Hatalı şifre!" });
        }

        // Giriş başarılı, kullanıcı bilgilerini dön
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;