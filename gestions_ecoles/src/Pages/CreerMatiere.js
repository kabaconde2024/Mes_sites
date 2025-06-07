import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Alert, 
  CircularProgress,
  InputAdornment,
  Chip
} from '@mui/material';
import { 
  Book,
  School,
  Person,
  Description,
  Numbers,
  Check,
  Clear,
  ArrowBack
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import SidebarAdmin from './SidebarAdmin';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const CreerMatiere = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    coefficient: '',
    enseignants: []
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/enseignants/listes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEnseignants(response.data);
      } catch (error) {
        setErrorMessage('Erreur lors du chargement des enseignants');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnseignants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEnseignantsChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      enseignants: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.coefficient) newErrors.coefficient = 'Le coefficient est obligatoire';
    else if (formData.coefficient < 1 || formData.coefficient > 10) {
      newErrors.coefficient = 'Le coefficient doit être entre 1 et 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return navigate('/connexion');
      }
  
      const response = await axios.post('http://localhost:5000/api/matieres', {
        nom: formData.nom,
        description: formData.description,
        coefficient: formData.coefficient,
        enseignants: formData.enseignants
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        validateStatus: function (status) {
          return status < 500;
        }
      });
  
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/CreerMatiere');
        }, 2000);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/connexion');
      } else {
        setErrorMessage(response.data?.message || 'Erreur lors de la création');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/connexion');
      } else {
        setErrorMessage(error.message || 'Erreur lors de la création');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
      <Header />   
         <SidebarAdmin />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Book sx={{ mr: 1 }} />
          Créer une nouvelle matière
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Check sx={{ mr: 1 }} />
            Matière créée avec succès! Redirection en cours...
          </Alert>
        )}
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Clear sx={{ mr: 1 }} />
            {errorMessage}
          </Alert>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Nom de la matière */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nom de la matière"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    error={!!errors.nom}
                    helperText={errors.nom}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Book />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Coefficient */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Coefficient (1-10)"
                    name="coefficient"
                    type="number"
                    value={formData.coefficient}
                    onChange={handleChange}
                    inputProps={{ min: 1, max: 10 }}
                    error={!!errors.coefficient}
                    helperText={errors.coefficient}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Numbers />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Enseignants */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Enseignants</InputLabel>
                    <Select
                      multiple
                      label="Enseignants"
                      value={formData.enseignants}
                      onChange={handleEnseignantsChange}
                      disabled={loading}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const enseignant = enseignants.find(e => e._id === value);
                            return enseignant ? (
                              <Chip 
                                key={value}
                                label={`${enseignant.nom} ${enseignant.prenom}`}
                                icon={<Person fontSize="small" />}
                              />
                            ) : null;
                          })}
                        </Box>
                      )}
                    >
                      {loading ? (
                        <MenuItem disabled>
                          <CircularProgress size={24} />
                        </MenuItem>
                      ) : (
                        enseignants.map((enseignant) => (
                          <MenuItem key={enseignant._id} value={enseignant._id}>
                            <Person sx={{ mr: 1 }} fontSize="small" />
                            {enseignant.nom} {enseignant.prenom}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Boutons de soumission */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mr: 2 }}
                    startIcon={<Check />}
                  >
                    Créer la matière
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/matieres')}
                    startIcon={<ArrowBack />}
                  >
                    Annuler
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CreerMatiere;