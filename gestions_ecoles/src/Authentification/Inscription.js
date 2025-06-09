import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  useMediaQuery, 
  useTheme,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  // États pour les champs de saisie
  const [nomUtilisateur, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [cin, setCin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('https://mes-sites.onrender.com/api/auth/inscription', {
        nomUtilisateur,
        email,
        motDePasse,
        cin
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         'Erreur lors de l\'inscription. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        p: isMobile ? 2 : 3
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : isTablet ? '450px' : '500px',
          p: isMobile ? 3 : 4,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography 
          variant={isMobile ? 'h6' : 'h5'} 
          align="center" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          Inscription
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom complet"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            size={isMobile ? 'small' : 'medium'}
            value={nomUtilisateur}
            onChange={(e) => setNom(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField 
            label="CIN"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            size={isMobile ? 'small' : 'medium'}
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            required
            size={isMobile ? 'small' : 'medium'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            required
            size={isMobile ? 'small' : 'medium'}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              py: isMobile ? 1 : 1.5,
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
        </form>
      </Box>

      {/* Snackbar pour les messages d'erreur/succès */}
      <Snackbar
        open={!!error || success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || 'Inscription réussie! Redirection en cours...'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupForm;