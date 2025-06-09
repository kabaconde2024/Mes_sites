import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  CircularProgress,
  InputAdornment,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Person, 
  PersonOutline, 
  Cake, 
  Home, 
  Email, 
  Phone, 
  Class, 
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import SidebarAdmin from './SidebarAdmin';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PageAjouterEleve = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // États du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    email: '',
    telephone: '',
    classe: '',
    statut: 'actif',
  });

  // États pour l'UI
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Chargement des classes disponibles
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('https://mes-sites.onrender.com/api/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setClasses(response.data);
        } else {
          setError('Format de données invalide pour les classes');
        }
      } catch (err) {
        setError('Erreur lors du chargement des classes');
        console.error("Détails de l'erreur:", err.response?.data || err.message);
      } finally {
        setLoadingClasses(false);
      }
    };
  
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // Validation côté client
    if (!formData.nom || !formData.prenom || !formData.email || !formData.classe) {
      setError('Veuillez remplir tous les champs obligatoires (Nom, Prénom, Email, Classe)');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');
      
      const dataToSend = {
        ...formData,
        telephone: formData.telephone || undefined,
        dateNaissance: formData.dateNaissance || undefined
      };

      const response = await axios.post(
        'https://mes-sites.onrender.com/api/eleves/ajout', 
        dataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(response.data.message || "Élève ajouté avec succès");
      setOpenSnackbar(true);
      
      setTimeout(() => {
        setFormData({
          nom: '',
          prenom: '',
          dateNaissance: '',
          adresse: '',
          email: '',
          telephone: '',
          classe: '',
          statut: 'actif',
        });
        navigate('/dashboardAdmin');
      }, 2000);

    } catch (err) {
      console.error("Erreur détaillée:", err);
      
      let errorMessage = "Erreur lors de l'ajout de l'élève";
      
      if (err.response) {
        errorMessage = err.response.data.message || 
                      err.response.data.error?.message || 
                      errorMessage;
        
        if (err.response.status === 400) {
          if (err.response.data.details) {
            errorMessage += ` (${JSON.stringify(err.response.data.details)})`;
          }
          if (err.response.data.error) {
            errorMessage += ` : ${JSON.stringify(err.response.data.error)}`;
          }
        }
      } else if (err.request) {
        errorMessage = "Pas de réponse du serveur - vérifiez votre connexion";
      } else {
        errorMessage = `Erreur de configuration: ${err.message}`;
      }
      
      setError(errorMessage);
      setOpenSnackbar(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      pt: { xs: '56px', sm: '64px' },
      bgcolor: '#f5f5f5'
    }}>
      <Header />
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%'
      }}>
        <SidebarAdmin />
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: { xs: 0, sm: theme.shape.borderRadius },
                boxShadow: { xs: 'none', sm: theme.shadows[3] },
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                  <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: { xs: 1, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                    }}
                  >
                    <Person sx={{ mr: 1, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }} />
                    Ajouter un Élève
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      {/* Nom */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Nom *"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          fullWidth
                          size={isMobile ? 'small' : 'medium'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonOutline fontSize={isMobile ? 'small' : 'medium'} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                      </Grid>
                      
                      {/* Prénom */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Prénom *"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          fullWidth
                          size={isMobile ? 'small' : 'medium'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonOutline fontSize={isMobile ? 'small' : 'medium'} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                      </Grid>
                      
                      {/* Date de Naissance */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Date de Naissance"
                          name="dateNaissance"
                          type="date"
                          value={formData.dateNaissance}
                          onChange={handleChange}
                          fullWidth
                          size={isMobile ? 'small' : 'medium'}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Cake fontSize={isMobile ? 'small' : 'medium'} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                      </Grid>
                      
                      {/* Adresse */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Adresse"
                          name="adresse"
                          value={formData.adresse}
                          onChange={handleChange}
                          fullWidth
                          size={isMobile ? 'small' : 'medium'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Home fontSize={isMobile ? 'small' : 'medium'} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                      </Grid>
                      
                      {/* Email */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email *"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          fullWidth
                          type="email"
                          size={isMobile ? 'small' : 'medium'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email fontSize={isMobile ? 'small' : 'medium'} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                      </Grid>
                      
                      {/* Téléphone */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Téléphone"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          fullWidth
                          type="tel"
                          size={isMobile ? 'small' : 'medium'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone fontSize={isMobile ? 'small' : 'medium'} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                      </Grid>
                      
                      {/* Classe */}
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                          <InputLabel>Classe *</InputLabel>
                          <Select
                            label="Classe *"
                            name="classe"
                            value={formData.classe}
                            onChange={handleChange}
                            disabled={loadingClasses}
                          >
                            {loadingClasses ? (
                              <MenuItem value="">
                                <CircularProgress size={isMobile ? 20 : 24} />
                              </MenuItem>
                            ) : (
                              classes.map((classe) => (
                                <MenuItem key={classe._id} value={classe._id}>
                                  <Class sx={{ mr: 1 }} fontSize={isMobile ? 'small' : 'medium'} />
                                  {classe.nom} ({classe.niveau})
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      {/* Statut */}
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                          <InputLabel>Statut</InputLabel>
                          <Select
                            label="Statut"
                            name="statut"
                            value={formData.statut}
                            onChange={handleChange}
                          >
                            <MenuItem value="actif">
                              <CheckCircle color="success" sx={{ mr: 1 }} fontSize={isMobile ? 'small' : 'medium'} />
                              Actif
                            </MenuItem>
                            <MenuItem value="inactif">
                              <Cancel color="error" sx={{ mr: 1 }} fontSize={isMobile ? 'small' : 'medium'} />
                              Inactif
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      {/* Bouton de soumission */}
                      <Grid item xs={12}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          color="primary" 
                          fullWidth
                          size={isMobile ? 'medium' : 'large'}
                          disabled={submitLoading}
                          startIcon={submitLoading ? <CircularProgress size={isMobile ? 20 : 24} color="inherit" /> : <Person />}
                          sx={{ 
                            mt: { xs: 1, sm: 2 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                          {submitLoading ? 'En cours...' : 'Ajouter Élève'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Snackbar pour les messages d'erreur/succès */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ 
              vertical: isMobile ? 'bottom' : 'top', 
              horizontal: 'center' 
            }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={error ? 'error' : 'success'}
              sx={{ 
                width: { xs: '90%', sm: '100%' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {error || success}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default PageAjouterEleve;