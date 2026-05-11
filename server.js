const express   = require('express');
const path      = require('path');
const session   = require('express-session');
require('dotenv').config();

const db        = require('./src/config/db');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();

// ── Middlewares ──────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Sesiones ─────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_dona_solina',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 2 }
}));

// ── Rutas API ─────────────────────────────────
app.use('/api', apiRoutes);

// ── Rutas de Vistas ───────────────────────────
app.get('/',         (req, res) => res.sendFile(path.join(__dirname, 'src/views/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'src/views/register.html')));
app.get('/home',     (req, res) => res.sendFile(path.join(__dirname, 'src/views/home.html')));

// ── Arranque del servidor ─────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`\n🚀 Servidor corriendo en: http://localhost:${PORT}`);

    // Test de conexión a la base de datos
    try {
        const [rows] = await db.query('SELECT 1 AS ok');
        if (rows[0].ok === 1) {
            console.log(`✅ BD conectada: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);
        }
    } catch (err) {
        console.error(`❌ Error de BD: ${err.message}`);
        console.error(`   → Verifica que MySQL esté activo y que .env tenga los datos correctos.`);
    }
});