import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Box, TextField, Button } from "@mui/material";
import axios from "axios";
import SidebarAdmin from "./SidebarAdmin"; // Import de SidebarAdmin

const ModifierPaiement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paiement = location.state.paiement; // Récupère le paiement à modifier

  const [formData, setFormData] = useState({
    eleveId: paiement.eleveId._id, // Ajoutez l'ID de l'élève ici
    tranche: paiement.tranche,
    montant: paiement.montant,
    anneeScolaire: paiement.anneeScolaire,
  });

  const [eleves, setEleves] = useState([]); // Pour stocker la liste des élèves

  const API_URL = "http://localhost:5000/api/paiements";
  const API_ELEVES_URL = "http://localhost:5000/api/eleves"; // URL pour récupérer la liste des élèves

  // Récupérer la liste des élèves
  useEffect(() => {
    axios.get(API_ELEVES_URL).then((response) => {
      setEleves(response.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${paiement._id}`, formData);
      navigate("/ListePaiement"); // Redirection après modification
    } catch (err) {
      console.error("Erreur lors de la mise à jour du paiement", err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SidebarAdmin /> {/* Ajoutez SidebarAdmin ici */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3 }}>
        <Card sx={{ width: 400, p: 2, margin: "auto" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom de l'Élève"
              variant="outlined"
              fullWidth
              name="eleveId"
              value={formData.eleveId}
              onChange={handleChange}
              required
              margin="normal"
              select
              SelectProps={{
                native: true,
              }}
            >
              {eleves.map((eleve) => (
                <option key={eleve._id} value={eleve._id}>
                  {eleve.nom}
                </option>
              ))}
            </TextField>

            <TextField
              label="Tranche"
              variant="outlined"
              fullWidth
              name="tranche"
              value={formData.tranche}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              label="Montant"
              variant="outlined"
              fullWidth
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              required
              margin="normal"
              type="number"
            />
            <TextField
              label="Année Scolaire"
              variant="outlined"
              fullWidth
              name="anneeScolaire"
              value={formData.anneeScolaire}
              onChange={handleChange}
              required
              margin="normal"
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="primary" type="submit">
                Enregistrer
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/liste-paiements")}
              >
                Annuler
              </Button>
            </Box>
          </form>
        </Card>
      </Box>
    </Box>
  );
};

export default ModifierPaiement;
