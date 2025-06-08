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
const morgan = require('morgan');

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
const PORT = process.env.PORT || 5000;

// Middleware de logging
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Vérification des variables d'environnement critiques
if (!process.env.MONGO_URI) {
  console.error('❌ Variable MONGO_URI manquante');
  process.exit(1);
}

if (!process.env.SESSION_SECRET && isProduction) {
  console.error('❌ Variable SESSION_SECRET manquante en production');
  process.exit(1);
}

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  } : false
}));

app.use(compression());
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Configuration CORS améliorée
const allowedOrigins = isProduction
  ? [
      'https://mes-sites-2.onrender.com',
      'https://mes-sites.onrender.com',
      process.env.FRONTEND_PROD_URL
    ].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'];

console.log('Origines autorisées:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Autoriser les requêtes sans origine (comme les apps mobiles ou Postman) en développement
      if (!isProduction) return callback(null, true);
      return callback(new Error('Origin required in production'), false);
    }

    const originIsAllowed = allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.replace(/^https?:\/\//, '') === allowedOrigin.replace(/^https?:\/\//, '')
    );

    if (originIsAllowed) {
      callback(null, true);
    } else {
      console.error('Origin non autorisé:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Configuration MongoDB
const mongoOptions = {
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
};

mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");
    console.log("Host MongoDB:", mongoose.connection.host);
  })
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB:", err);
    process.exit(1);
  });

// Configuration des sessions
app.use(session({
  name: 'kankadi.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
      secret: process.env.STORE_SECRET || 'dev-store-secret'
    },
    ttl: 86400
  }),
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 86400000,
    domain: isProduction ? '.render.com' : undefined
  }
}));

// Configuration Socket.IO
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
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

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPPEMENT'}`);
});

// Gestion propre des arrêts
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});