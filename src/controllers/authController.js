/* ================================================
   authController.js - Productos Regionales Web
   ================================================ */

const db = require('../config/db');
const bcrypt = require('bcryptjs');

/* ─────────────────────────────────────────────
   POST /api/auth/login
───────────────────────────────────────────── */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    try {
        // Alias 'pwd' evita cualquier problema con el carácter ñ en JS
        const [rows] = await db.query(
            'SELECT id_usuario, nombre_user, rol, estado, `contraseña` AS pwd FROM usuario WHERE correo = ? AND estado = "activo" LIMIT 1',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        const user = rows[0];

        // Comparar contraseña hasheada usando el alias 'pwd'
        const match = await bcrypt.compare(password, user.pwd);
        if (!match) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        // Guardar sesión
        req.session.userId = user.id_usuario;
        req.session.userName = user.nombre_user;
        req.session.userRol = user.rol;

        return res.status(200).json({
            message: 'Login exitoso.',
            user: {
                id: user.id_usuario,
                nombre: user.nombre_user,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('[LOGIN] Error:', error.message);
        return res.status(500).json({ message: 'Error interno.', detail: error.message });
    }
};

/* ─────────────────────────────────────────────
   POST /api/auth/register
───────────────────────────────────────────── */
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        // Verificar si el correo ya existe
        const [existing] = await db.query(
            'SELECT id_usuario FROM usuario WHERE correo = ? LIMIT 1',
            [email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ message: 'El correo ya está registrado.' });
        }

        // Hash de la contraseña (bcrypt genera ~60 chars, columna debe ser varchar(255))
        const hashed = await bcrypt.hash(password, 10);

        // INSERT usando backtick para columna con ñ
        await db.query(
            'INSERT INTO usuario (nombre_user, correo, `contraseña`, rol, estado) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashed, 'cliente', 'activo']
        );

        return res.status(201).json({ message: 'Cuenta creada exitosamente.' });

    } catch (error) {
        console.error('[REGISTER] Error:', error.message, '| Code:', error.code);
        return res.status(500).json({ message: 'Error interno.', detail: error.message });
    }
};

/* ─────────────────────────────────────────────
   GET /api/auth/logout
───────────────────────────────────────────── */
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.status(200).json({ message: 'Sesión cerrada' });
    });
};

module.exports = { login, register, logout };
