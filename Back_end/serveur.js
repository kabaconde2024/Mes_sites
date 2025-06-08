require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const http = require('http');
const socketIo = require('socket.io');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import des routes
const enseignantRoutes = require("./routes/routesEnseignant");
const emploiDuTempsRoutes = require("./routes/routesEmploi");
const routesAuth = require('./routes/routesAuth');
const routesEleve = require('./routes/routesEleve');
const routesPaiement = require("./routes/routesPaiement");
const routesOffre = require("./routes/routesOffre");
const routesCandidature = require("./routes/routesCandidature");
const routesClasse = require('./routes/classeRoutes');
const routesMatiere = require('./routes/matiereRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const server = http.createServer(app);

// Configuration de base
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 10000; // Modifié pour correspondre à votre port

// Middleware de logging simplifié (remplace morgan)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Vérification des variables d'environnement
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI est requis');
  process.exit(1);
}

if (isProduction && !process.env.SESSION_SECRET) {
  console.error('❌ SESSION_SECRET est requis en production');
  process.exit(1);
}

// Middlewares de sécurité
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Configuration CORS améliorée
const allowedOrigins = isProduction
  ? [
      'https://mes-sites.onrender.com',
      'https://mes-sites-2.onrender.com',
      'https://mes-sites-backend.onrender.com',
      process.env.FRONTEND_PROD_URL
    ].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:10000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine en développement (Postman, etc.)
    if (!origin && !isProduction) return callback(null, true);
    
    // Autoriser toutes les sous-domaines .render.com en production
    if (isProduction && origin && (origin.endsWith('.render.com') || allowedOrigins.includes(origin))) {
      return callback(null, true);
    }
    
    if (!isProduction && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.warn('🚨 Origin non autorisé:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Gestion des requêtes OPTIONS (pré-vol)
app.options('*', cors(corsOptions));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => {
  console.error('❌ Erreur MongoDB:', err);
  process.exit(1);
});

// Configuration de session améliorée
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60 // 1 jour
  }),
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    domain: isProduction ? '.render.com' : undefined,
    maxAge: 86400000,
    path: '/'
  }
}));

// Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: isProduction ? [
      'https://mes-sites.onrender.com',
      'https://mes-sites-2.onrender.com'
    ] : allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  allowEIO3: true
});

// Middleware pour ajouter io aux requêtes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/enseignants", enseignantRoutes);
app.use("/api/emplois", emploiDuTempsRoutes);
app.use("/api/auth", routesAuth);
app.use("/api/eleves", routesEleve);
app.use("/api/paiements", routesPaiement);
app.use("/api/offres", routesOffre);
app.use("/api/candidatures", routesCandidature);
app.use("/api/classes", routesClasse);
app.use("/api/matieres", routesMatiere);
app.use("/api/notes", noteRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Gestion des erreurs améliorée
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      ...(!isProduction && { stack: err.stack })
    }
  });
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${isProduction ? 'Production' : 'Développement'}`);
  console.log(`🔗 Origines autorisées: ${allowedOrigins.join(', ')}`);
});

// Gestion des erreurs non catchées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});