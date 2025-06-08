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
  Snackbar
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
import dayjs from 'dayjs';

const PageAjouterEleve = () => {
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

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fermeture de la snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // Validation côté client
    if (!formData.nom || !formData.prenom || !formData.email || !formData.classe) {
      setError('Veuillez remplir tous les champs obligatoires (Nom, Prénom, Email, Classe)');
      return;
    }

    // Validation email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');
      
      // Formatage des données pour l'envoi
      const dataToSend = {
        ...formData,
        telephone: formData.telephone || undefined, // optional
        dateNaissance: formData.dateNaissance || undefined // optional
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
  
      console.log("Réponse du serveur:", response.data);
      
      // Affichage du message de succès
      setSuccess(response.data.message || "Élève ajouté avec succès");
      setOpenSnackbar(true);
      
      // Réinitialisation du formulaire après 2 secondes
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
        // Erreur avec réponse du serveur
        errorMessage = err.response.data.message || 
                      err.response.data.error?.message || 
                      errorMessage;
        
        // Erreur de validation côté serveur
        if (err.response.status === 400) {
          if (err.response.data.details) {
            errorMessage += ` (${JSON.stringify(err.response.data.details)})`;
          }
          // Erreur de duplication
          if (err.response.data.error) {
            errorMessage += ` : ${JSON.stringify(err.response.data.error)}`;
          }
        }
      } else if (err.request) {
        // Pas de réponse du serveur
        errorMessage = "Pas de réponse du serveur - vérifiez votre connexion";
      } else {
        // Erreur de configuration
        errorMessage = `Erreur de configuration: ${err.message}`;
      }
      
      setError(errorMessage);
      setOpenSnackbar(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
      <Header />
      <SidebarAdmin />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Ajouter un Élève
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Nom */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Nom *"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutline />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Prénom */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Prénom *"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutline />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Date de Naissance */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Date de Naissance"
                        name="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Cake />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Adresse */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Home />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Email */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email *"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        type="email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Téléphone */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Téléphone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        fullWidth
                        type="tel"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Classe */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Classe *</InputLabel>
                        <Select
                          label="Classe *"
                          name="classe"
                          value={formData.classe}
                          onChange={handleChange}
                          disabled={loadingClasses}
                          startAdornment={
                            <InputAdornment position="start">
                              <Class />
                            </InputAdornment>
                          }
                        >
                          {loadingClasses ? (
                            <MenuItem value="">
                              <CircularProgress size={24} />
                            </MenuItem>
                          ) : (
                            classes.map((classe) => (
                              <MenuItem key={classe._id} value={classe._id}>
                                <Class sx={{ mr: 1 }} />
                                {classe.nom} ({classe.niveau})
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* Statut */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Statut</InputLabel>
                        <Select
                          label="Statut"
                          name="statut"
                          value={formData.statut}
                          onChange={handleChange}
                        >
                          <MenuItem value="actif">
                            <CheckCircle color="success" sx={{ mr: 1 }} />
                            Actif
                          </MenuItem>
                          <MenuItem value="inactif">
                            <Cancel color="error" sx={{ mr: 1 }} />
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
                        size="large"
                        disabled={submitLoading}
                        startIcon={submitLoading ? <CircularProgress size={24} color="inherit" /> : <Person />}
                        sx={{ mt: 2 }}
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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default PageAjouterEleve;