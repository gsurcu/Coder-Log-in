const express = require('express')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { ProductosDaoMongoDb } = require('../models/index')
const rutasProductos = require('./productos/productos.routes')
const config = require('../config/config')
const rutasLogin = require('./login/login.routes')

const router = express.Router();
const productos = new ProductosDaoMongoDb("productos")


// Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(session({
  name: 'my-session',
  secret: 'top-secret-51',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: config.mongodb
  }),
  cookie: {
    maxAge: 600000
  }
}));
// Rutas
router.use('/', rutasLogin)
router.use('/api/productos', rutasProductos);
router.use('/api/*', (req, res) => {
  res.status(404).json({
    error: -2,
    descripcion: `La ruta ${req.baseUrl} con el metodo ${req.method} no esta implementado`,
  });
});

module.exports = router;