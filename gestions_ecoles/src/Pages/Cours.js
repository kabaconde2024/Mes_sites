// Cours.js
import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Cours = () => {
  const coursData = [
    { id: 1, titre: 'Mathématiques', description: 'Cours de mathématiques avancées', enseignant: 'M. Dupont' },
    { id: 2, titre: 'Physique', description: 'Cours de physique appliquée', enseignant: 'Mme Durand' },
    { id: 3, titre: 'Chimie', description: 'Cours de chimie organique', enseignant: 'M. Martin' },
  ];

  return (
    <Box p={3}>

      <Typography variant="h4" gutterBottom>
        Mes Cours
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: 2 }}
        onClick={() => alert('Ajouter un cours')}
      >
        Ajouter un cours
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Enseignant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coursData.map((cours) => (
              <TableRow key={cours.id}>
                <TableCell>{cours.id}</TableCell>
                <TableCell>{cours.titre}</TableCell>
                <TableCell>{cours.description}</TableCell>
                <TableCell>{cours.enseignant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Cours;
