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
  InputAdornment
} from '@mui/material';
import { 
  School,
  Class,
  Person,
  Book,
  Add,
  Delete,
  Check,
  Clear,
  ArrowBack
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import SidebarAdmin from './SidebarAdmin';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const CreerClasse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    niveau: '',
    matieres: []
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState({
    enseignants: false,
    matieres: false
  });

  const niveaux = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, enseignants: true, matieres: true }));
        const token = localStorage.getItem('token');
        
        // Fetch matieres
        const matieresResponse = await axios.get('https://mes-sites.onrender.com/api/matieres', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Gestion de la réponse des matières
        const matieresData = matieresResponse.data?.data || matieresResponse.data || [];
        setMatieres(Array.isArray(matieresData) ? matieresData : []);

        // Fetch enseignants
        const enseignantsResponse = await axios.get('https://mes-sites.onrender.com/api/enseignants/listes', {
          headers: { Authorization: `Bearer ${token}` },
          params: { populate: 'matiere' }
        });
        
        // Gestion de la réponse des enseignants
        const enseignantsData = enseignantsResponse.data?.data || enseignantsResponse.data || [];
        setEnseignants(Array.isArray(enseignantsData) ? enseignantsData : []);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setErrorMessage(`Erreur lors du chargement des données: ${error.message}`);
        setMatieres([]);
        setEnseignants([]);
      } finally {
        setLoading(prev => ({ ...prev, enseignants: false, matieres: false }));
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMatiereChange = (index, field, value) => {
    const newMatieres = [...formData.matieres];
    newMatieres[index][field] = value;
    setFormData({
      ...formData,
      matieres: newMatieres
    });
  };

  const addMatiere = () => {
    setFormData({
      ...formData,
      matieres: [...formData.matieres, { matiere: '', enseignant: '' }]
    });
  };

  const removeMatiere = (index) => {
    const newMatieres = [...formData.matieres];
    newMatieres.splice(index, 1);
    setFormData({
      ...formData,
      matieres: newMatieres
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.niveau) newErrors.niveau = 'Le niveau est obligatoire';
    
    formData.matieres.forEach((matiere, index) => {
      if (!matiere.matiere) newErrors[`matiere-${index}`] = 'Matière obligatoire';
      if (!matiere.enseignant) newErrors[`enseignant-${index}`] = 'Enseignant obligatoire';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  try {
    const token = localStorage.getItem('token');
    // Vérification supplémentaire des données
    const isValidData = formData.matieres.every(m => 
      m.matiere && m.enseignant && 
      matieres.some(mat => mat._id === m.matiere || mat.id === m.matiere) &&
      enseignants.some(ens => ens._id === m.enseignant || ens.id === m.enseignant)
    );
    
    if (!isValidData) {
      throw new Error('Données invalides: vérifiez les matières et enseignants sélectionnés');
    }

    const dataToSend = {
      nom: formData.nom,
      niveau: formData.niveau,
      matieres: formData.matieres.map(m => ({
        matiere: m.matiere,
        enseignant: m.enseignant
      }))
    };

    const response = await axios.post('https://mes-sites.onrender.com/api/classes', dataToSend, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboardAdmin');
      }, 2000);
    }
  } catch (error) {
    console.error('Erreur création classe:', error);
    setErrorMessage(
      error.response?.data?.message || 
      error.message || 
      'Erreur lors de la création de la classe'
    );
  }
};

  return (
    <Box sx={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
      <Header />    
      <SidebarAdmin />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <School sx={{ mr: 1 }} />
          Créer une nouvelle classe
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Check sx={{ mr: 1 }} />
            Classe créée avec succès! Redirection en cours...
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nom de la classe"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    error={!!errors.nom}
                    helperText={errors.nom}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Class />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.niveau}>
                    <InputLabel>Niveau</InputLabel>
                    <Select
                      label="Niveau"
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <School />
                        </InputAdornment>
                      }
                    >
                      {niveaux.map((niveau) => (
                        <MenuItem key={niveau} value={niveau}>
                          {niveau}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.niveau && (
                      <Typography variant="caption" color="error">
                        {errors.niveau}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Book sx={{ mr: 1 }} />
                    Matières
                  </Typography>
                  
                  {formData.matieres.map((matiere, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={5}>
                        <FormControl fullWidth error={!!errors[`matiere-${index}`]}>
                          <InputLabel>Matière</InputLabel>
                          <Select
                            label="Matière"
                            value={matiere.matiere}
                            onChange={(e) => handleMatiereChange(index, 'matiere', e.target.value)}
                            disabled={loading.matieres}
                          >
                            {loading.matieres ? (
                              <MenuItem value="">
                                <CircularProgress size={24} />
                              </MenuItem>
                            ) : (
                              matieres.length > 0 ? (
                                matieres.map((mat) => (
                                  <MenuItem key={mat._id || mat.id} value={mat._id || mat.id}>
                                    <Book sx={{ mr: 1 }} fontSize="small" />
                                    {mat.nom} (Coef: {mat.coefficient})
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  Aucune matière disponible
                                </MenuItem>
                              )
                            )}
                          </Select>
                          {errors[`matiere-${index}`] && (
                            <Typography variant="caption" color="error">
                              {errors[`matiere-${index}`]}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <FormControl fullWidth error={!!errors[`enseignant-${index}`]}>
                          <InputLabel>Enseignant</InputLabel>
                          <Select
                            label="Enseignant"
                            value={matiere.enseignant}
                            onChange={(e) => handleMatiereChange(index, 'enseignant', e.target.value)}
                            disabled={loading.enseignants}
                          >
                            {loading.enseignants ? (
                              <MenuItem value="">
                                <CircularProgress size={24} />
                              </MenuItem>
                            ) : (
                              enseignants.length > 0 ? (
                                enseignants.map((ens) => (
                                  <MenuItem key={ens._id || ens.id} value={ens._id || ens.id}>
                                    <Person sx={{ mr: 1 }} fontSize="small" />
                                    {ens.nom} {ens.prenom}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  Aucun enseignant disponible
                                </MenuItem>
                              )
                            )}
                          </Select>
                          {errors[`enseignant-${index}`] && (
                            <Typography variant="caption" color="error">
                              {errors[`enseignant-${index}`]}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => removeMatiere(index)}
                          sx={{ height: '100%' }}
                          fullWidth
                          startIcon={<Delete />}
                        >
                          Supprimer
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  
                  <Button
                    variant="outlined"
                    onClick={addMatiere}
                    sx={{ mt: 1 }}
                    startIcon={<Add />}
                  >
                    Ajouter une matière
                  </Button>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mr: 2 }}
                    startIcon={<Check />}
                  >
                    Créer la classe
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/classes')}
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

export default CreerClasse;