import React, { useState, useEffect } from "react";
import SidebarAdmin from "./SidebarAdmin";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
const ListePaiement = () => {
  const [paiements, setPaiements] = useState([]);
  const API_URL = "https://mes-sites.onrender.com/api/paiements";
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer la liste des paiements
    const fetchPaiements = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaiements(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
      }
    };
    fetchPaiements();
  }, []);

  const handleDeletePaiement = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaiements(paiements.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression du paiement :", err);
    }
  };

  const handleEditPaiement = (paiement) => {
    navigate(`/ModifierPaiement/${paiement._id}`, { state: { paiement } });
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
      <Header />   
         <SidebarAdmin />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3 }}>
        <Card sx={{ p: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Élève</TableCell>
                <TableCell>Tranche</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Année Scolaire</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paiements.map((paiement) => (
                <TableRow key={paiement._id}>
                  <TableCell>
                    {paiement.eleveId ? paiement.eleveId.nom : "Non renseigné"}
                  </TableCell>
                  <TableCell>{paiement.tranche}</TableCell>
                  <TableCell>{paiement.montant}</TableCell>
                  <TableCell>{paiement.anneeScolaire}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditPaiement(paiement)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletePaiement(paiement._id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </Box>
  );
};

export default ListePaiement;
