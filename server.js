const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middlewares para leer formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos (CSS, JS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Sesiones (Fundamental para Login)
app.use(session({
    secret: 'clave_secreta_dona_solina',
    resave: false,
    saveUninitialized: true
}));

// --- RUTAS DE NAVEGACIÓN ---

// Vista inicial: Login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/login.html'));
});

// Vista de Registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/register.html'));
});

// Vista del Dashboard (Home)
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

// Encender el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Doña Solina corriendo en: http://localhost:${PORT}`);
});