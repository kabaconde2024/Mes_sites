import { Drawer, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import AddTeacherIcon from '@mui/icons-material/PersonAddAlt1';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';
import ListAltIcon from '@mui/icons-material/ListAlt';

const SidebarAdmin = () => {

  // Utilisez ce code à la place de votre appel direct à ipapi.co
async function fetchIPData() {
  try {
    // Solution avec proxy CORS public
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://ipapi.co/json/');
    
    // Alternative si le proxy public est saturé
    // const response = await fetch('https://ipwho.is/');
    
    const data = await response.json();
    console.log("Données IP:", data);
    return data;
  } catch (error) {
    console.error("Erreur de récupération des données IP:", error);
    
    // Fallback avec JSONP si tout échoue
    return new Promise((resolve) => {
      window.handleIPData = (data) => {
        delete window.handleIPData;
        resolve(data);
      };
      const script = document.createElement('script');
      script.src = 'https://ipapi.co/json/?callback=handleIPData';
      document.body.appendChild(script);
    });
  }
}

// Utilisation exemple
fetchIPData().then(data => {
  // Utilisez les données ici
  console.log("Pays:", data.country_name);
  console.log("Ville:", data.city);
});
  const navigate = useNavigate();

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#444444',
          color: '#fff',
          position: 'fixed',
          height: 'calc(100vh - 64px)',
          top: '64px'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ padding: 2 }}>
   
      </Box>
      <List>
        {/* Dashboard */}
        <ListItem
          button
          onClick={() => navigate("/dashboardAdmin")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <DashboardIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Élèves */}
        <ListItem
          button
          onClick={() => navigate("/ajouterEleve")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <PersonAddIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Ajouter Élève" />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate("/listeEleve")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <PeopleIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Liste des Élèves" />
        </ListItem>

        {/* Enseignants */}
        <ListItem
          button
          onClick={() => navigate("/ajouterEnseignant")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <AddTeacherIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Ajouter Enseignant" />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate("/ListeEnseignant")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <PeopleIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Liste des Enseignants" />
        </ListItem>

        {/* Gestion scolaire */}
        <ListItem
          button
          onClick={() => navigate("/CreerClasse")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <PeopleIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Créer une Classe" />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate("/CreerMatiere")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <PeopleIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Créer une Matière" />
        </ListItem>

        {/* Emploi du temps */}
        <ListItem
          button
          onClick={() => navigate("/EmploiEleve")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <ScheduleIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Emploi du Temps" />
        </ListItem>

        {/* Paiements */}
        <ListItem
          button
          onClick={() => navigate("/Paiement")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <PaymentIcon sx={{ marginRight: 1, color: '#d7c797' }} />

          <ListItemText primary="Gestion des Paiements" />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate("/ListePaiement")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <ListAltIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Liste des Paiements" />
        </ListItem>


        <ListItem
          button
          onClick={() => navigate("/Note")}
          sx={{
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#d7c797',
            },
          }}
        >
          <ListAltIcon sx={{ marginRight: 1, color: '#d7c797' }} />
          <ListItemText primary="Note" />
        </ListItem>


        {/* Offres et candidatures */}
       

       
      </List>
    </Drawer>
  );
};

export default SidebarAdmin;