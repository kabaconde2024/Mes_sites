import React, { useState } from 'react';
import { Button, TextField, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user?.role);  // Stocke le rôle de l'utilisateur
  
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
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      p={isMobile ? 2 : 4}
      bgcolor={isMobile ? "rgba(255, 255, 255, 0.9)" : "transparent"}
    >
      {/* Conteneur principal avec image et formulaire */}
      <Box 
        display="flex" 
        flexDirection={isMobile ? 'column' : 'row'} 
        justifyContent="center" 
        alignItems="center" 
        width="100%"
        maxWidth={isTablet ? '800px' : '1200px'}
        bgcolor="rgba(255, 255, 255, 0.8)" 
        borderRadius={2} 
        boxShadow={3}
        p={isMobile ? 3 : 4}
      >
        {/* Description et image */}
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          flexDirection="column" 
          width={isMobile ? '100%' : '50%'}
          pr={isMobile ? 0 : 4}
          mb={isMobile ? 4 : 0}
          textAlign="center"
        >
          <Typography 
            variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'} 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Bienvenue sur la plateforme scolaire !
          </Typography>
          <Typography 
            variant={isMobile ? 'body2' : 'body1'} 
            color="textSecondary" 
            paragraph
            sx={{ mb: 2 }}
          >
            Nous sommes ravis de vous accueillir. Connectez-vous pour accéder à vos ressources pédagogiques,
            gérer vos cours et bien plus encore.
          </Typography>
          {!isMobile && (
            <img 
              src="/image.jpg" 
              alt="Bienvenue sur la plateforme" 
              style={{ 
                width: '100%', 
                maxWidth: isTablet ? '250px' : '300px', 
                borderRadius: '8px', 
                objectFit: 'cover',
                marginTop: '16px'
              }} 
            />
          )}
          {isMobile && (
            <Typography variant="body2" mt={2}>
              Vous n'avez pas de compte ?{' '}
              <Link to="/Inscription" style={{ color: theme.palette.primary.main }}>
                Inscrivez-vous ici
              </Link>
            </Typography>
          )}
        </Box>

        {/* Formulaire de connexion */}
        <Box 
          component="form" 
          width={isMobile ? '100%' : '50%'}
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          onSubmit={handleLogin}
        >
          <Typography 
            variant={isMobile ? 'h6' : 'h4'} 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Connexion
          </Typography>
          
          {error && (
            <Typography 
              color="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            autoComplete="off"
            margin="normal"
            required
            size={isMobile ? 'small' : 'medium'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 1.5 }}
          />
          
          <TextField
            label="Mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            autoComplete="off"
            margin="normal"
            required
            size={isMobile ? 'small' : 'medium'}
            value={motDePasse}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ 
              mt: 1,
              mb: 2,
              py: isMobile ? 1 : 1.5,
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            Se connecter
          </Button>
          
          {!isMobile && (
            <Box mt={1} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Vous n'avez pas de compte ?{' '}
                <Link 
                  to="/Inscription" 
                  style={{ 
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Inscrivez-vous ici
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Connexion;