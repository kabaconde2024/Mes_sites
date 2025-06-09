import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  School, 
  Groups, 
  LibraryBooks, 
  ContactMail,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Accueil = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
      <Header />
      <Box sx={{ 
        flexGrow: 1, 
        pt: { xs: '56px', sm: '64px' } // Ajustement pour le header sur mobile
      }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            color: 'white',
            py: { xs: 6, sm: 8 },
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography 
              variant={isMobile ? 'h3' : 'h2'} 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: isMobile ? '2rem' : isTablet ? '2.5rem' : '3rem'
              }}
            >
              Bienvenue sur EduManage
            </Typography>
            <Typography 
              variant={isMobile ? 'body1' : 'h5'} 
              component="p" 
              gutterBottom 
              sx={{ 
                mb: 4,
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              La plateforme de gestion scolaire complète pour l'ISMG
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size={isMobile ? 'medium' : 'large'}
              endIcon={<ArrowForward />}
              onClick={() => navigate('/formation')}
              sx={{ 
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: isMobile ? '0.9rem' : '1.1rem'
              }}
            >
              Découvrir nos formations
            </Button>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 8 } }}>
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 4, sm: 6 },
              fontSize: isMobile ? '1.5rem' : '2rem'
            }}
          >
            Nos Fonctionnalités
          </Typography>
          <Grid container spacing={isMobile ? 2 : 4}>
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
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    textAlign: 'center',
                    p: { xs: 2, sm: 3 }
                  }}>
                    <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                      {React.cloneElement(feature.icon, { 
                        fontSize: isMobile ? 'medium' : 'large' 
                      })}
                    </Box>
                    <Typography 
                      variant={isMobile ? 'subtitle1' : 'h6'} 
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: isMobile ? '1rem' : '1.25rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: isMobile ? '0.875rem' : '1rem'
                      }}
                    >
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
            py: { xs: 6, sm: 8 },
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                fontSize: isMobile ? '1.5rem' : '2rem'
              }}
            >
              Prêt à transformer votre expérience scolaire ?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size={isMobile ? 'medium' : 'large'}
              onClick={() => navigate('/contact')}
              sx={{ 
                px: { xs: 4, sm: 6 },
                py: { xs: 1, sm: 1.5 },
                fontSize: isMobile ? '0.9rem' : '1.1rem'
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