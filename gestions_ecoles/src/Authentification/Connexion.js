import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
// Utilisez ce code à la place de votre appel direct à ipapi.co
async function fetchIPData() {
  try {
    // Solution avec proxy CORS public
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://ipapi.co/json/');
    
    // Alternative si le proxy public est saturé
    // const response = await fetch('https://ipwho.is/');
    
    const data = await response.json();
    console.log("Données IP:", data);
    return data;
  } catch (error) {
    console.error("Erreur de récupération des données IP:", error);
    
    // Fallback avec JSONP si tout échoue
    return new Promise((resolve) => {
      window.handleIPData = (data) => {
        delete window.handleIPData;
        resolve(data);
      };
      const script = document.createElement('script');
      script.src = 'https://ipapi.co/json/?callback=handleIPData';
      document.body.appendChild(script);
    });
  }
}

// Utilisation exemple
fetchIPData().then(data => {
  // Utilisez les données ici
  console.log("Pays:", data.country_name);
  console.log("Ville:", data.city);
});
  const handleLogin = (e) => {
    e.preventDefault();

    // Envoi des données au backend via Axios
    axios.post('https://mes-sites.onrender.com/api/auth/connexion', { email, motDePasse })
    .then((response) => {
      // Si la connexion est réussie
      console.log("Connexion réussie !", response.data);
  
      // Stocke les informations de session côté frontend
      sessionStorage.setItem('user', JSON.stringify(response.data.user)); // Stocke l'utilisateur dans sessionStorage
      sessionStorage.setItem('token', response.data.token); // Stocke le token dans sessionStorage
  // Après une connexion réussie  
       localStorage.setItem('token', response.data.token);
       // Stocke aussi le rôle de l'utilisateur
localStorage.setItem('userRole', response.data.user?.role);  // Assurez-vous que le rôle est bien sauvegardé

       // Assurez-vous que le token est bien récupéré
      // Vérifier le rôle de l'utilisateur et rediriger vers le tableau de bord approprié
      const role = response.data.user?.role;
      console.log("role !", role);
  
      // Rediriger en fonction du rôle
      if (role === 'admin') {
        navigate("/dashboardAdmin");
      } else if (role === 'professeur') {
        navigate("/dashboardEnseignant");
      } else if (role === 'eleve') {
        navigate("/dashboardEtudiant");
      } else {
        setError('Rôle inconnu');
      }
    })
    .catch((err) => {
      // En cas d'erreur
      setError('Identifiants invalides');
      console.log("Erreur de connexion", err);
    });
  
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      {/* Conteneur principal avec image et formulaire */}
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" width="100%" height="100%" p={4} bgcolor="rgba(255, 255, 255, 0.8)" borderRadius={2} boxShadow={3}>
        {/* Description et image */}
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" width="50%" pr={4} mb={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Bienvenue sur la plateforme scolaire !
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" paragraph>
            Nous sommes ravis de vous accueillir. Connectez-vous pour accéder à vos ressources pédagogiques,
            gérer vos cours et bien plus encore. Si vous n'avez pas encore de compte, inscrivez-vous et rejoignez-nous !
          </Typography>
          <img src="/image.jpg" alt="Bienvenue sur la plateforme" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', objectFit: 'cover' }} />
        </Box>

        {/* Formulaire de connexion */}
        <Box component="form" width="50%" display="flex" flexDirection="column" alignItems="center" onSubmit={handleLogin}>
          <Typography variant="h5" align="center" gutterBottom>
            Connexion
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            autoComplete="off"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            autoComplete="off"
            margin="normal"
            required
            value={motDePasse}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Se connecter
          </Button>
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Vous n'avez pas de compte ?{' '}
             <Link to="/Inscription">Inscrivez-vous ici</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Connexion;
