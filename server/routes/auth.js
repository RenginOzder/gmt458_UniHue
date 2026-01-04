const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- KAYIT OL (REGISTER) ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Rol ve Üniversite Belirleme Mantığı
    let userRole = 'basic';
    let userUni = null;

    // Eğer mail adresi .edu.tr içeriyorsa direkt 'student' yapıyoruz.
    if (email.includes('.edu.tr')) {
      userRole = 'student';
      userUni = 'other'; // Listede olmayan bir üniversiteyse 'other' olsun

      // Şimdi tek tek Ankara'daki üniversiteleri kontrol edelim
      if (email.includes('@hacettepe.edu.tr')) {
        userUni = 'hacettepe';
      } else if (email.includes('@metu.edu.tr')) {
        userUni = 'odtu';
      } else if (email.includes('@ankara.edu.tr')) {
        userUni = 'ankara';
      } else if (email.includes('@gazi.edu.tr')) {
        userUni = 'gazi';
      } else if (email.includes('@atilim.edu.tr')) {
        userUni = 'atilim';
      } else if (email.includes('@bilkent.edu.tr')) {
        userUni = 'bilkent';
      } else if (email.includes('@cankaya.edu.tr')) {
        userUni = 'cankaya';
      } else if (email.includes('@aybu.edu.tr')) { // Yıldırım Beyazıt
        userUni = 'yildirim';
      } else if (email.includes('@ufuk.edu.tr')) {
        userUni = 'ufuk';
      } else if (email.includes('@etu.edu.tr')) { // TOBB ETÜ
        userUni = 'tobb';
      } else if (email.includes('@tedu.edu.tr')) { // TED Üniversitesi
        userUni = 'ted';
      }
    }

    // 2. Şifreleme (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Yeni Kullanıcıyı Oluştur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole,
      university: userUni
    });

    // 4. Kaydet
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);

  } catch (err) {
    console.log(err); // Hatayı konsolda görelim
    res.status(500).json(err);
  }
});

// --- GİRİŞ YAP (LOGIN) ---
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("Kullanıcı bulunamadı!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Şifre yanlış!");

    const token = jwt.sign(
      { id: user._id, role: user.role, university: user.university },
      process.env.JWT_SECRET || "gizliAnahtar", 
      { expiresIn: "1d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;