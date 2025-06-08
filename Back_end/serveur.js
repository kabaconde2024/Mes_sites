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
const PORT = process.env.PORT || 5000;

// Middleware de logging simplifié (remplace morgan)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
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

// Configuration CORS
const allowedOrigins = isProduction
  ? [
      'https://mes-sites-2.onrender.com',
      'https://mes-sites.onrender.com',
      process.env.FRONTEND_PROD_URL
    ].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && !isProduction) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    console.warn('Origin non autorisé:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => {
  console.error('❌ Erreur MongoDB:', err);
  process.exit(1);
});

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 86400000
  }
}));

// Socket.IO
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
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
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});