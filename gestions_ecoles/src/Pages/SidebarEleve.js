import { Drawer, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';

const SidebarEleve = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#444444', // Fond noir
          color: '#fff', // Texte en blanc
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" sx={{ color: '#FFFFFF' }}>
          Tableau de bord Élève
        </Typography>
      </Box>

      <List>
        {/* Toujours visible pour l'élève */}
        <ListItem button onClick={() => navigate("/dashboardEtudiant")}>
          <ListItemText primary="Mon Dashboard" />
        </ListItem>

    
        <ListItem
  button
  onClick={() => navigate("/ListesOffre")}
  sx={{
    '&:hover': {
      backgroundColor: '#FFFFFF',
      color: '#d7c797',
    },
  }}
>
  <ListAltIcon sx={{ marginRight: 1, color: '#d7c797' }} />
  <ListItemText primary="Listes des Offres" />
</ListItem>


<ListItem
  button
  onClick={() => navigate("/ListeEmploi")}
  sx={{
    '&:hover': {
      backgroundColor: '#FFFFFF',
      color: '#d7c797',
    },
  }}
>
  <ListAltIcon sx={{ marginRight: 1, color: '#d7c797' }} />
  <ListItemText primary="Mes Emplois" />
</ListItem>

        {/* L'éléve n'a pas accès à ces options */}
        {/* Pas d'accès à la gestion des enseignants ou des élèves */}
      </List>
    </Drawer>
  );
};

export default SidebarEleve;
