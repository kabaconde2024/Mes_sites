// SidebarProfesseur.js
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SidebarProfesseur = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Accueil', path: '/dashboardEnseignant' },
    { text: 'Mes Cours', path: '/Cours' },
    { text: 'Mes Étudiants', path: '/enseignant/etudiants' },
    { text: 'Emploi du Temps', path: '/emploi' },
    { text: 'Paramètres', path: '/enseignant/parametres' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#444444', // Fond noir
          color: '#fff', 
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarProfesseur;
