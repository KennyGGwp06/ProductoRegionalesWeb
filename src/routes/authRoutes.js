/* ================================================
   authRoutes.js - Productos Regionales Web
   Rutas de autenticación: /api/auth/*
   ================================================ */

const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login',    authController.login);

// POST /api/auth/register
router.post('/register', authController.register);

// GET  /api/auth/logout
router.get('/logout',    authController.logout);

module.exports = router;
