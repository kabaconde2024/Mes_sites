import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  useMediaQuery, 
  useTheme,
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import AddTeacherIcon from '@mui/icons-material/PersonAddAlt1';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useState } from 'react';

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawerWidth = 240;

  const menuItems = [
    { icon: <DashboardIcon />, text: "Dashboard", path: "/dashboardAdmin" },
    { icon: <PersonAddIcon />, text: "Ajouter Élève", path: "/ajouterEleve" },
    { icon: <PeopleIcon />, text: "Liste des Élèves", path: "/listeEleve" },
    { icon: <AddTeacherIcon />, text: "Ajouter Enseignant", path: "/ajouterEnseignant" },
    { icon: <PeopleIcon />, text: "Liste des Enseignants", path: "/ListeEnseignant" },
    { icon: <PeopleIcon />, text: "Créer une Classe", path: "/CreerClasse" },
    { icon: <PeopleIcon />, text: "Créer une Matière", path: "/CreerMatiere" },
    { icon: <ScheduleIcon />, text: "Emploi du Temps", path: "/EmploiEleve" },
    { icon: <PaymentIcon />, text: "Gestion des Paiements", path: "/Paiement" },
    { icon: <ListAltIcon />, text: "Liste des Paiements", path: "/ListePaiement" },
    { icon: <ListAltIcon />, text: "Note", path: "/Note" }
  ];

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed',
            left: 10,
            top: 10,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: '#444444',
            color: '#d7c797',
            '&:hover': {
              backgroundColor: '#555555'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#444444',
            color: '#fff',
            height: isMobile ? '100vh' : 'calc(100vh - 64px)',
            top: isMobile ? 0 : '64px',
            overflowY: 'auto',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!open && {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: 0,
              [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
              },
            }),
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        {isMobile && (
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: theme.spacing(0, 1),
              ...theme.mixins.toolbar,
            }}
          >
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon sx={{ color: '#d7c797' }} />
            </IconButton>
          </Box>
        )}
        
        <Box 
          sx={{ 
            padding: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              color: '#d7c797',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Menu Admin
          </Typography>
          <Divider sx={{ width: '80%', bgcolor: '#d7c797', mb: 2 }} />
        </Box>
        
        <List sx={{ paddingBottom: { xs: 2, sm: 0 } }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => {
                navigate(item.path);
                if (isMobile) setOpen(false);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  color: '#d7c797',
                },
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1, sm: 2 }
              }}
            >
              <Box sx={{ 
                color: '#d7c797',
                minWidth: { xs: 30, sm: 40 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 'medium',
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                  }
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SidebarAdmin;