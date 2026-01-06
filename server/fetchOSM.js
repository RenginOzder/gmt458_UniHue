// server/fetchOSM.js
const axios = require('axios');
const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const ANKARA_LAT = 39.9208;
const ANKARA_LON = 32.8541;
const RADIUS = 20000;

const LINKS = {
    THEATER_GENERAL: "https://biletinial.com/tr-tr/mekan/ankara-devlet-tiyatrolari",
    CINEMA: "https://www.paribucineverse.com/",
    OPERA: "https://biletinial.com/tr-tr/etkinlik-takvimi/713",
    CSO: "https://biletinial.com/tr-tr/etkinlikleri/cso-ada-etkinlikleri"
};

const VIP_EVENTS = [
    {
        name: "Ankara Devlet Opera ve Balesi",
        lat: 39.9385,
        lon: 32.8540,
        type: "opera", // YENİ TÜR: Pembe olacak
        link: LINKS.OPERA,
        desc: "Devlet Opera ve Balesi ana sahnesi."
    },
    {
        name: "CSO Ada Ankara",
        lat: 39.9312,
        lon: 32.8465,
        type: "cso", // YENİ TÜR: Koyu Mavi olacak
        link: LINKS.CSO,
        desc: "Cumhurbaşkanlığı Senfoni Orkestrası."
    }
];

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const QUERY = `
    [out:json];
    (
      node["amenity"="theatre"](around:${RADIUS},${ANKARA_LAT},${ANKARA_LON});
      node["amenity"="cinema"](around:${RADIUS},${ANKARA_LAT},${ANKARA_LON});
    );
    out body;
`;

const BLACKLIST = ["Market", "Tarım", "Kredi", "Bakkal", "Büfe", "Store", "Shop", "Opera"];

const fetchAndSeed = async () => {
    try {
        console.log("🌍 Veriler renk kodları için güncelleniyor...");
        const response = await axios.get(OVERPASS_URL, { params: { data: QUERY } });
        const osmPlaces = response.data.elements;

        await mongoose.connect(process.env.MONGO_URI);
        
        let botUser = await User.findOne({ email: "smart_bot@maps.com" });
        if (!botUser) {
            botUser = await User.create({ username: "Etkinlik Botu", email: "smart_bot@maps.com", password: "bot", role: "student", university: "other" });
        }

        // Temizlik
        await Event.deleteMany({ creator: botUser._id });

        const eventsToAdd = [];

        // 1. VIP Noktalar
        VIP_EVENTS.forEach(vip => {
            eventsToAdd.push({
                title: vip.name,
                description: `${vip.desc}\n\n${vip.link}`, // Linki doğrudan sona ekledim
                type: vip.type, // opera, cso
                date: new Date(),
                universityScope: "All",
                creator: botUser._id,
                location: { type: "Point", coordinates: [vip.lon, vip.lat] }
            });
        });

        // 2. OSM Noktaları
        osmPlaces.forEach(place => {
            if (place.tags && place.tags.name) {
                const name = place.tags.name;
                const isSpam = BLACKLIST.some(badWord => name.includes(badWord));

                if (!isSpam) {
                    let eventType = "theater"; // Varsayılan: Tiyatro (Bordo)
                    let link = LINKS.THEATER_GENERAL;

                    if (place.tags.amenity === 'cinema' || name.toLowerCase().includes('sinema')) {
                        eventType = "cinema"; // Sinema (Mor)
                        link = LINKS.CINEMA;
                    }

                    const randomDate = new Date();
                    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 7));

                    eventsToAdd.push({
                        title: name,
                        description: `Etkinlik Detayları ve Biletler.\n\n${link}`,
                        type: eventType,
                        date: randomDate,
                        universityScope: "All",
                        creator: botUser._id,
                        location: { type: "Point", coordinates: [place.lon, place.lat] }
                    });
                }
            }
        });

        if (eventsToAdd.length > 0) await Event.insertMany(eventsToAdd);
        console.log(`✅ Renk kodlu veriler yüklendi! (${eventsToAdd.length} adet)`);
        mongoose.connection.close();

    } catch (err) { console.error(err); }
};

fetchAndSeed();