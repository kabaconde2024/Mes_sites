import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container,
  useTheme
} from '@mui/material';
import { 
  School, 
  Groups, 
  LibraryBooks, 
  ContactMail,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Import du composant Header

const Accueil = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <School fontSize="large" color="primary" />,
      title: "Gestion des Élèves",
      description: "Suivi complet des dossiers scolaires et administratifs des élèves."
    },
    {
      icon: <Groups fontSize="large" color="primary" />,
      title: "Gestion des Enseignants",
      description: "Administration du personnel enseignant et de leurs attributions."
    },
    {
      icon: <LibraryBooks fontSize="large" color="primary" />,
      title: "Programmes Scolaires",
      description: "Organisation et suivi des programmes pédagogiques."
    },
    {
      icon: <ContactMail fontSize="large" color="primary" />,
      title: "Communication",
      description: "Outils de communication avec les parents et les élèves."
    }
  ];

  return (
    <>
      <Header /> {/* Intégration du Header */}
      <Box sx={{ flexGrow: 1, pt: 8 }}> {/* Ajout de padding-top pour compenser le header fixe */}
        {/* Hero Section */}
        <Box 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            color: 'white',
            py: 8,
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Bienvenue sur EduManage
            </Typography>
            <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
              La plateforme de gestion scolaire complète pour l'ISMG
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/formation')}
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Découvrir nos formations
            </Button>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
            Nos Fonctionnalités
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Call to Action */}
        <Box 
          sx={{ 
            bgcolor: theme.palette.grey[100],
            py: 8,
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Prêt à transformer votre expérience scolaire ?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/contact')}
              sx={{ 
                px: 6,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Nous contacter
            </Button>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Accueil;