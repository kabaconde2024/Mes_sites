import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Card,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from "@mui/material";
import {
  Person,
  Payment,
  AttachMoney,
  School,
  Add,
  Clear,
  Check
} from "@mui/icons-material";
import SidebarAdmin from "./SidebarAdmin";

const AjoutPaiement = () => {
  const [eleveId, setEleveId] = useState("");
  const [tranche, setTranche] = useState("");
  const [montant, setMontant] = useState("");
  const [anneeScolaire, setAnneeScolaire] = useState("");
  const [eleves, setEleves] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://mes-sites.onrender.com/api/paiements";
  const API_ELEVES_URL = "https://mes-sites.onrender.com/api/eleves";
  const anneesScolaires = ["2023-2024", "2024-2025", "2025-2026"];

  useEffect(() => {
    const fetchEleves = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(API_ELEVES_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const elevesData = response.data?.data || response.data;
        
        if (Array.isArray(elevesData)) {
          setEleves(elevesData);
        } else {
          console.error("Format de réponse inattendu:", elevesData);
          setError("Format des données incorrect");
          setEleves([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves :", error);
        setError("Erreur lors du chargement des élèves");
        setEleves([]);
      }
    };
    fetchEleves();
  }, []);

  const handleAddPaiement = async () => {
    try {
      if (!eleveId || !tranche || !montant || !anneeScolaire) {
        setError("Tous les champs sont obligatoires");
        return;
      }

      const token = localStorage.getItem("token");
      const newPaiement = { 
        eleveId, 
        tranche, 
        montant: parseFloat(montant), 
        anneeScolaire 
      };
      
      const response = await axios.post(`${API_URL}/ajout`, newPaiement, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setSuccess(true);
        clearForm();
        
        // Utilisation d'un setTimeout avec un cleanup dans le useEffect
        const timer = setTimeout(() => {
          navigate('/dashboardAdmin');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Erreur lors de l'ajout du paiement";
      setError(errorMessage);
      console.error("Erreur détaillée:", err.response?.data || err.message);
    }
  };

  const clearForm = () => {
    setEleveId("");
    setTranche("");
    setMontant("");
    setAnneeScolaire("");
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
      <Header />
      <SidebarAdmin />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Payment sx={{ mr: 1 }} />
            Ajouter un Paiement
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Clear sx={{ mr: 1 }} />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Check sx={{ mr: 1 }} />
              Paiement ajouté avec succès! Redirection en cours...
            </Alert>
          )}

          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Élève</InputLabel>
              <Select
                value={eleveId}
                onChange={(e) => setEleveId(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>Sélectionner un élève</em>
                </MenuItem>
                {Array.isArray(eleves) && eleves.map((eleve) => (
                  <MenuItem key={eleve._id} value={eleve._id}>
                    {eleve.nom} {eleve.prenom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tranche"
              value={tranche}
              onChange={(e) => setTranche(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Payment />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Montant"
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Année Scolaire</InputLabel>
              <Select
                value={anneeScolaire}
                onChange={(e) => setAnneeScolaire(e.target.value)}
                required
                startAdornment={
                  <InputAdornment position="start">
                    <School />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>Sélectionner une année scolaire</em>
                </MenuItem>
                {anneesScolaires.map((annee) => (
                  <MenuItem key={annee} value={annee}>
                    {annee}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPaiement}
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Ajouter le paiement
            </Button>
          </Paper>
        </Card>
      </Box>
    </Box>
  );
};

export default AjoutPaiement;