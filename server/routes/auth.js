const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// REGISTER (KAYIT OL)
router.post('/register', async (req, res) => {
    try {
        // Şifreleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Yeni Kullanıcı Oluştur
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            university: req.body.university, // BURASI EKSİKTİ, ARTIK VAR ✅
            role: req.body.role || "student"
        });

        const user = await newUser.save();
        res.status(200).json(user._id);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// LOGIN (GİRİŞ YAP)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json("Kullanıcı bulunamadı!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Şifre yanlış!");

        // Frontend'e üniversite bilgisini de gönderiyoruz
        res.status(200).json({ 
            _id: user._id, 
            username: user.username, 
            role: user.role, 
            university: user.university 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;