const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Database file path
const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Helper: Read database
function readDB() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Return default structure if file doesn't exist
        return {
            config: {
                event: {
                    childName: "",
                    childNickname: "",
                    childPhoto: "assets/images/child.jpg",
                    parentNames: { father: "", mother: "" },
                    quote: "",
                    quoteTranslation: ""
                },
                prosesiKhitan: {
                    date: "",
                    time: "",
                    endTime: "",
                    location: "",
                    address: "",
                    mapsUrl: ""
                },
                syukuran: {
                    date: "",
                    time: "",
                    endTime: "",
                    location: "",
                    address: "",
                    mapsUrl: ""
                },
                digitalEnvelope: {
                    enabled: true,
                    banks: []
                },
                music: {
                    enabled: true,
                    autoplay: true,
                    src: "assets/audio/background.mp3"
                }
            },
            guests: [],
            wishes: [],
            gallery: []
        };
    }
}

// Helper: Write database
function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// ============================================
// CONFIG ENDPOINTS
// ============================================
app.get('/api/config', (req, res) => {
    const db = readDB();
    res.json(db.config);
});

app.post('/api/config', (req, res) => {
    const db = readDB();
    db.config = req.body;
    writeDB(db);
    res.json({ success: true, message: 'Config saved' });
});

app.get('/api/config/full', (req, res) => {
    const db = readDB();
    res.json(db);
});

// ============================================
// GUESTS ENDPOINTS
// ============================================
app.get('/api/guests', (req, res) => {
    const db = readDB();
    res.json(db.guests || []);
});

app.post('/api/guests', (req, res) => {
    const db = readDB();
    const guest = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: req.body.name,
        createdAt: new Date().toISOString()
    };
    db.guests = db.guests || [];
    db.guests.push(guest);
    writeDB(db);
    res.json({ success: true, guest });
});

app.delete('/api/guests/:id', (req, res) => {
    const db = readDB();
    db.guests = (db.guests || []).filter(g => g.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
});

// ============================================
// WISHES ENDPOINTS
// ============================================
app.get('/api/wishes', (req, res) => {
    const db = readDB();
    res.json(db.wishes || []);
});

app.post('/api/wishes', (req, res) => {
    const db = readDB();
    const wish = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: req.body.name,
        message: req.body.message,
        attendance: req.body.attendance,
        guestsCount: req.body.guestsCount || 1,
        createdAt: new Date().toISOString()
    };
    db.wishes = db.wishes || [];
    db.wishes.push(wish);
    writeDB(db);
    res.json({ success: true, wish });
});

app.delete('/api/wishes/:id', (req, res) => {
    const db = readDB();
    db.wishes = (db.wishes || []).filter(w => w.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/wishes', (req, res) => {
    const db = readDB();
    db.wishes = [];
    writeDB(db);
    res.json({ success: true });
});

// ============================================
// GALLERY ENDPOINTS
// ============================================
app.get('/api/gallery', (req, res) => {
    const db = readDB();
    res.json(db.gallery || []);
});

app.post('/api/gallery', (req, res) => {
    const db = readDB();
    const image = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        url: req.body.url,
        createdAt: new Date().toISOString()
    };
    db.gallery = db.gallery || [];
    db.gallery.push(image);
    writeDB(db);
    res.json({ success: true, image });
});

app.delete('/api/gallery/:id', (req, res) => {
    const db = readDB();
    db.gallery = (db.gallery || []).filter(g => g.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
});

// ============================================
// START SERVER (Development) / Export (Vercel)
// ============================================

// For Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api/config`);
    });
}
