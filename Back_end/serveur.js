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

// Vérification des variables d'environnement
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'présent' : 'manquant');
console.log('FRONTEND_PROD_URL:', process.env.FRONTEND_PROD_URL || 'non défini');

// Middlewares de sécurité
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Configuration CORS
const allowedOrigins = isProduction
  ? [process.env.FRONTEND_PROD_URL]
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
}));

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
  w: 'majority'
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
  secret: process.env.SESSION_SECRET || 'fallback-secret-123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
      secret: process.env.STORE_SECRET || 'fallback-store-secret-456'
    },
    ttl: 86400
  }),
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 86400000,
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
  }
}));

// Configuration Socket.IO
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket'],
  allowEIO3: true
});

io.on('connection', (socket) => {
  console.log(`Nouvelle connexion Socket.IO: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Déconnexion Socket.IO: ${socket.id}`);
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} a rejoint la room ${room}`);
  });
});

// Routes API
app.use('/api/auth', routesAuth);
app.use('/api/eleves', routesEleve);
app.use("/api/enseignants", enseignantRoutes);
app.use("/api/emploi", emploiDuTempsRoutes);
app.use("/api/paiements", routesPaiement);
app.use("/api/offres", routesOffre);
app.use("/api/candidatures", routesCandidature);
app.use("/api/classes", routesClasse);
app.use("/api/matieres", routesMatiere);
app.use('/api/notes', noteRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend Kankadi Internationale en marche',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// Gestion des erreurs
app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Erreur interne du serveur',
    ...(!isProduction && { stack: err.stack })
  });
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPPEMENT'}`);
  console.log(`Origines autorisées: ${allowedOrigins.join(', ')}`);
  console.log(`URL MongoDB: ${mongoose.connection.host || 'Non connecté'}`);
});

// Gestion des erreurs non catchées
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});