import React from 'react';
import SidebarEleve from './SidebarEleve';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf'; // Import correct de pdfjs

const DashboardEtudiant = () => {
  return (
    <Box display="flex">
      {/* Sidebar */}
      <SidebarEleve />

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
          Bienvenue sur votre Tableau de Bord, Étudiant !
        </Typography>

       
      </Box>
    </Box>
  );
};

export default DashboardEtudiant;