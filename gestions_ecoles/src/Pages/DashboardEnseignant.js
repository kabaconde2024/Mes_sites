// DashboardEnseignant.js
import React from 'react';
import SidebarProfesseur from './SidebarProfesseur';
import { Box, Typography, Paper, Grid } from '@mui/material';

const DashboardEnseignant = () => {
  return (
    <Box display="flex">
      {/* Sidebar */}
      <SidebarProfesseur />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          Bienvenue sur votre Tableau de Bord, Enseignant !
        </Typography>

        {/* Dashboard Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#ffffff',
                boxShadow: 2,
              }}
            >
              <Typography variant="h6">Mes Cours</Typography>
              <Typography variant="body1">Voir la liste et les détails de vos cours.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#ffffff',
                boxShadow: 2,
              }}
            >
              <Typography variant="h6">Étudiants</Typography>
              <Typography variant="body1">Gérez vos étudiants et leurs performances.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#ffffff',
                boxShadow: 2,
              }}
            >
              <Typography variant="h6">Emploi du Temps</Typography>
              <Typography variant="body1">Consultez votre emploi du temps.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardEnseignant;
