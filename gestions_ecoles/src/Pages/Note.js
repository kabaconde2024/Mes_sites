import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Person,
  AttachMoney,
  School,
  Add,
  Edit,
  Delete,
  Search,
  Close,
  Check,
  Visibility
} from "@mui/icons-material";
import SidebarAdmin from "./SidebarAdmin";
import Header from "./Header";

// Configuration d'axios pour inclure le token JWT
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    eleve: "",
    matiere: "",
    enseignant: "",
    valeur: "",
    commentaire: "",
    typeEvaluation: "devoir",
    periode: "trimestre1"
  });
  
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    eleve: "",
    matiere: "",
    periode: ""
  });

  // Fetch data with improved error handling and response structure handling
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch all data in parallel
      const [notesRes, elevesRes, matieresRes, enseignantsRes] = await Promise.all([
        axios.get("https://mes-sites.onrender.com/api/notes"),
        axios.get("https://mes-sites.onrender.com/api/eleves"),
        axios.get("https://mes-sites.onrender.com/api/matieres"),
        axios.get("https://mes-sites.onrender.com/api/enseignants/listes")
      ]);
      
      // Handle different response structures (data.data or just data)
      setNotes(notesRes.data?.data || notesRes.data || []);
      setEleves(elevesRes.data?.data || elevesRes.data || []);
      setMatieres(matieresRes.data?.data || matieresRes.data || []);
      setEnseignants(enseignantsRes.data?.data || enseignantsRes.data || []);
      
      // Log data for debugging
      console.log("Élèves chargés:", elevesRes.data?.data || elevesRes.data);
      console.log("Matieres chargées:", matieresRes.data?.data || matieresRes.data);
      console.log("Enseignants chargés:", enseignantsRes.data?.data || enseignantsRes.data);
      
    } catch (err) {
      console.error("Erreur détaillée:", err.response || err);
      setError(`Erreur lors du chargement: ${err.message || "Veuillez vérifier votre connexion"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Safe filtering of notes
  const filteredNotes = notes.filter(note => {
    try {
      const hasEleve = note.eleve && (filters.eleve === "" || note.eleve._id === filters.eleve);
      const hasMatiere = note.matiere && (filters.matiere === "" || note.matiere._id === filters.matiere);
      
      return (
        hasEleve &&
        hasMatiere &&
        (filters.periode === "" || note.periode === filters.periode)
      );
    } catch (err) {
      console.error("Erreur de filtrage:", err);
      return false;
    }
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      eleve: "",
      matiere: "",
      periode: ""
    });
  };

  // Create new note with error handling
  const handleCreateNote = async () => {
    try {
      setError("");
      const res = await axios.post("https://mes-sites.onrender.com/api/notes", formData);
      
      if (!res.data) {
        throw new Error("Réponse invalide du serveur");
      }
      
      // Handle both response structures
      const newNote = res.data?.data || res.data;
      setNotes([...notes, newNote]);
      setSuccess("Note ajoutée avec succès");
      setOpenCreateDialog(false);
      setFormData({
        eleve: "",
        matiere: "",
        enseignant: "",
        valeur: "",
        commentaire: "",
        typeEvaluation: "devoir",
        periode: "trimestre1"
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Erreur lors de l'ajout de la note";
      setError(errorMessage);
    }
  };

  // Update note with error handling
  const handleUpdateNote = async () => {
    try {
      if (!currentNote) return;
      
      setError("");
      const res = await axios.put(`https://mes-sites.onrender.com/api/notes/${currentNote._id}`, formData);
      
      if (!res.data) {
        throw new Error("Réponse invalide du serveur");
      }
      
      // Handle both response structures
      const updatedNote = res.data?.data || res.data;
      setNotes(notes.map(note => note._id === currentNote._id ? updatedNote : note));
      setSuccess("Note mise à jour avec succès");
      setOpenEditDialog(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Erreur lors de la mise à jour de la note";
      setError(errorMessage);
    }
  };

  // Delete note with confirmation
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;
    
    try {
      setError("");
      await axios.delete(`https://mes-sites.onrender.com/api/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      setSuccess("Note supprimée avec succès");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Erreur lors de la suppression de la note";
      setError(errorMessage);
    }
  };

  // Open edit dialog with data validation
  const openEditNoteDialog = (note) => {
    if (!note || !note.eleve || !note.matiere || !note.enseignant) {
      setError("Données de note incomplètes pour l'édition");
      return;
    }
    
    setCurrentNote(note);
    setFormData({
      eleve: note.eleve._id,
      matiere: note.matiere._id,
      enseignant: note.enseignant._id,
      valeur: note.valeur,
      commentaire: note.commentaire || "",
      typeEvaluation: note.typeEvaluation || "devoir",
      periode: note.periode || "trimestre1"
    });
    setOpenEditDialog(true);
  };

  // Open view dialog with data validation
  const openViewNoteDialog = (note) => {
    if (!note) {
      setError("Note invalide");
      return;
    }
    setCurrentNote(note);
    setOpenViewDialog(true);
  };

  // Close all dialogs
  const handleCloseDialogs = () => {
    setOpenCreateDialog(false);
    setOpenEditDialog(false);
    setOpenViewDialog(false);
  };

  // Close alerts after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <Box sx={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
      <Header />
      <SidebarAdmin />
      
      <Container maxWidth="lg" sx={{ p: 3, overflow: 'auto' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Gestion des Notes
        </Typography>
        
        {/* Alerts with close button */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}
        
        {/* Filters section */}
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtres
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Élève</InputLabel>
              <Select
                name="eleve"
                value={filters.eleve}
                onChange={handleFilterChange}
                label="Élève"
              >
                <MenuItem value="">Tous les élèves</MenuItem>
                {Array.isArray(eleves) && eleves.length > 0 ? (
                  eleves.map(eleve => (
                    <MenuItem key={eleve._id} value={eleve._id}>
                      {eleve.nom} {eleve.prenom}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Aucun élève disponible</MenuItem>
                )}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Matière</InputLabel>
              <Select
                name="matiere"
                value={filters.matiere}
                onChange={handleFilterChange}
                label="Matière"
              >
                <MenuItem value="">Toutes les matières</MenuItem>
                {Array.isArray(matieres) && matieres.map(matiere => (
                  <MenuItem key={matiere._id} value={matiere._id}>
                    {matiere.nom} (Coeff: {matiere.coefficient})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Période</InputLabel>
              <Select
                name="periode"
                value={filters.periode}
                onChange={handleFilterChange}
                label="Période"
              >
                <MenuItem value="">Toutes les périodes</MenuItem>
                <MenuItem value="trimestre1">Trimestre 1</MenuItem>
                <MenuItem value="trimestre2">Trimestre 2</MenuItem>
                <MenuItem value="trimestre3">Trimestre 3</MenuItem>
                <MenuItem value="semestre1">Semestre 1</MenuItem>
                <MenuItem value="semestre2">Semestre 2</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={resetFilters}
              sx={{ height: 40 }}
            >
              Réinitialiser
            </Button>
          </Box>
        </Paper>
        
        {/* Actions section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Liste des Notes
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
            disabled={loading}
          >
            Ajouter une Note
          </Button>
        </Box>
        
        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Chargement en cours...</Typography>
          </Box>
        )}
        
        {/* Notes Table */}
        {!loading && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Élève</TableCell>
                  <TableCell>Matière</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Période</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNotes.length > 0 ? (
                  filteredNotes.map(note => (
                    <TableRow key={note._id}>
                      <TableCell>
                        {note.eleve?.nom} {note.eleve?.prenom}
                      </TableCell>
                      <TableCell>{note.matiere?.nom}</TableCell>
                      <TableCell>
                        <Box 
                          sx={{ 
                            fontWeight: 'bold',
                            color: note.valeur >= 10 ? 'success.main' : 'error.main'
                          }}
                        >
                          {note.valeur}/20
                        </Box>
                      </TableCell>
                      <TableCell>
                        {note.periode === "trimestre1" && "Trimestre 1"}
                        {note.periode === "trimestre2" && "Trimestre 2"}
                        {note.periode === "trimestre3" && "Trimestre 3"}
                        {note.periode === "semestre1" && "Semestre 1"}
                        {note.periode === "semestre2" && "Semestre 2"}
                      </TableCell>
                      <TableCell>
                        {note.typeEvaluation === "devoir" && "Devoir"}
                        {note.typeEvaluation === "examen" && "Examen"}
                        {note.typeEvaluation === "projet" && "Projet"}
                        {note.typeEvaluation === "participation" && "Participation"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Voir détails">
                          <IconButton 
                            onClick={() => openViewNoteDialog(note)}
                            color="info"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton 
                            onClick={() => openEditNoteDialog(note)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            onClick={() => handleDeleteNote(note._id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1">
                        {notes.length === 0 ? 
                          "Aucune note disponible" : 
                          "Aucune note ne correspond à vos filtres"}
                      </Typography>
                      {notes.length === 0 && (
                        <Button 
                          variant="text" 
                          startIcon={<Add />}
                          onClick={() => setOpenCreateDialog(true)}
                          sx={{ mt: 1 }}
                        >
                          Ajouter une note
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Create Note Dialog */}
        <Dialog 
          open={openCreateDialog} 
          onClose={handleCloseDialogs} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>Ajouter une Nouvelle Note</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Élève *</InputLabel>
                <Select
                  name="eleve"
                  value={formData.eleve}
                  onChange={handleInputChange}
                  label="Élève *"
                >
                  {Array.isArray(eleves) && eleves.length > 0 ? (
                    eleves.map(eleve => (
                      <MenuItem key={eleve._id} value={eleve._id}>
                        {eleve.nom} {eleve.prenom}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Aucun élève disponible</MenuItem>
                  )}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small" required>
                <InputLabel>Matière *</InputLabel>
                <Select
                  name="matiere"
                  value={formData.matiere}
                  onChange={handleInputChange}
                  label="Matière *"
                >
                  {Array.isArray(matieres) && matieres.map(matiere => (
                    <MenuItem key={matiere._id} value={matiere._id}>
                      {matiere.nom} (Coeff: {matiere.coefficient})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small" required>
                <InputLabel>Enseignant *</InputLabel>
                <Select
                  name="enseignant"
                  value={formData.enseignant}
                  onChange={handleInputChange}
                  label="Enseignant *"
                >
                  {Array.isArray(enseignants) && enseignants.map(enseignant => (
                    <MenuItem key={enseignant._id} value={enseignant._id}>
                      {enseignant.nom} {enseignant.prenom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                name="valeur"
                label="Note *"
                type="number"
                value={formData.valeur}
                onChange={handleInputChange}
                fullWidth
                size="small"
                inputProps={{ 
                  min: 0, 
                  max: 20, 
                  step: 0.25 
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">/20</InputAdornment>,
                }}
                required
              />
              
              <FormControl fullWidth size="small" required>
                <InputLabel>Type d'évaluation *</InputLabel>
                <Select
                  name="typeEvaluation"
                  value={formData.typeEvaluation}
                  onChange={handleInputChange}
                  label="Type d'évaluation *"
                >
                  <MenuItem value="devoir">Devoir</MenuItem>
                  <MenuItem value="examen">Examen</MenuItem>
                  <MenuItem value="projet">Projet</MenuItem>
                  <MenuItem value="participation">Participation</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small" required>
                <InputLabel>Période *</InputLabel>
                <Select
                  name="periode"
                  value={formData.periode}
                  onChange={handleInputChange}
                  label="Période *"
                >
                  <MenuItem value="trimestre1">Trimestre 1</MenuItem>
                  <MenuItem value="trimestre2">Trimestre 2</MenuItem>
                  <MenuItem value="trimestre3">Trimestre 3</MenuItem>
                  <MenuItem value="semestre1">Semestre 1</MenuItem>
                  <MenuItem value="semestre2">Semestre 2</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                name="commentaire"
                label="Commentaire (optionnel)"
                value={formData.commentaire}
                onChange={handleInputChange}
                fullWidth
                size="small"
                multiline
                rows={3}
                placeholder="Remarques sur l'évaluation..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Annuler</Button>
            <Button 
              onClick={handleCreateNote} 
              variant="contained" 
              startIcon={<Check />}
              disabled={!formData.eleve || !formData.matiere || !formData.enseignant || !formData.valeur}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit Note Dialog */}
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseDialogs} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>Modifier la Note</DialogTitle>
          <DialogContent>
            {currentNote && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <TextField
                  label="Élève"
                  value={`${currentNote.eleve?.nom} ${currentNote.eleve?.prenom}`}
                  fullWidth
                  size="small"
                  disabled
                />
                
                <TextField
                  label="Matière"
                  value={currentNote.matiere?.nom}
                  fullWidth
                  size="small"
                  disabled
                />
                
                <TextField
                  name="valeur"
                  label="Note *"
                  type="number"
                  value={formData.valeur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  inputProps={{ 
                    min: 0, 
                    max: 20, 
                    step: 0.25 
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">/20</InputAdornment>,
                  }}
                  required
                />
                
                <FormControl fullWidth size="small" required>
                  <InputLabel>Type d'évaluation *</InputLabel>
                  <Select
                    name="typeEvaluation"
                    value={formData.typeEvaluation}
                    onChange={handleInputChange}
                    label="Type d'évaluation *"
                  >
                    <MenuItem value="devoir">Devoir</MenuItem>
                    <MenuItem value="examen">Examen</MenuItem>
                    <MenuItem value="projet">Projet</MenuItem>
                    <MenuItem value="participation">Participation</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small" required>
                  <InputLabel>Période *</InputLabel>
                  <Select
                    name="periode"
                    value={formData.periode}
                    onChange={handleInputChange}
                    label="Période *"
                  >
                    <MenuItem value="trimestre1">Trimestre 1</MenuItem>
                    <MenuItem value="trimestre2">Trimestre 2</MenuItem>
                    <MenuItem value="trimestre3">Trimestre 3</MenuItem>
                    <MenuItem value="semestre1">Semestre 1</MenuItem>
                    <MenuItem value="semestre2">Semestre 2</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  name="commentaire"
                  label="Commentaire (optionnel)"
                  value={formData.commentaire}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  placeholder="Remarques sur l'évaluation..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Annuler</Button>
            <Button 
              onClick={handleUpdateNote} 
              variant="contained" 
              startIcon={<Check />}
            >
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* View Note Dialog */}
        <Dialog 
          open={openViewDialog} 
          onClose={handleCloseDialogs} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>Détails de la Note</DialogTitle>
          <DialogContent>
            {currentNote && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <TextField
                  label="Élève"
                  value={`${currentNote.eleve?.nom} ${currentNote.eleve?.prenom}`}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                
                <TextField
                  label="Matière"
                  value={currentNote.matiere?.nom}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                
                <TextField
                  label="Enseignant"
                  value={`${currentNote.enseignant?.nom} ${currentNote.enseignant?.prenom}`}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                
                <TextField
                  label="Note"
                  value={`${currentNote.valeur}/20`}
                  fullWidth
                  size="small"
                  InputProps={{ 
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box 
                          component="span" 
                          sx={{ 
                            color: currentNote.valeur >= 10 ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {currentNote.valeur >= 10 ? '✓' : '✗'}
                        </Box>
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField
                  label="Type d'évaluation"
                  value={
                    currentNote.typeEvaluation === "devoir" ? "Devoir" : 
                    currentNote.typeEvaluation === "examen" ? "Examen" :
                    currentNote.typeEvaluation === "projet" ? "Projet" : 
                    "Participation"
                  }
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                
                <TextField
                  label="Période"
                  value={
                    currentNote.periode === "trimestre1" ? "Trimestre 1" :
                    currentNote.periode === "trimestre2" ? "Trimestre 2" :
                    currentNote.periode === "trimestre3" ? "Trimestre 3" :
                    currentNote.periode === "semestre1" ? "Semestre 1" : 
                    "Semestre 2"
                  }
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                
                <TextField
                  label="Date d'évaluation"
                  value={new Date(currentNote.dateEvaluation).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                
                <TextField
                  label="Commentaire"
                  value={currentNote.commentaire || "Aucun commentaire"}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Note;