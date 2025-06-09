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
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

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
        pt: { xs: '56px', sm: '64px' }, // Adjust for header height
        bgcolor: theme.palette.background.default
      }}>
        {/* Hero Section - Drupal-like Header Region */}
        <Box 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            color: 'white',
            py: { xs: 3, sm: 4, md: 6, lg: 8 },
            px: { xs: 1, sm: 2, md: 3 },
            textAlign: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'} 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' }
              }}
            >
              Bienvenue sur EduManage
            </Typography>
            <Typography 
              variant={isMobile ? 'body1' : 'h6'} 
              component="p" 
              gutterBottom 
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                maxWidth: { sm: '80%', md: '60%' },
                mx: 'auto'
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
                px: { xs: 2, sm: 3, md: 4, lg: 5 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }
              }}
            >
              Découvrir nos formations
            </Button>
          </Container>
        </Box>

        {/* Features Section - Drupal-like Content Region */}
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6, lg: 8 } }}>
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }
            }}
          >
            Nos Fonctionnalités
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    boxShadow: theme.shadows[1],
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[6]
                    },
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    textAlign: 'center',
                    p: { xs: 2, sm: 3, md: 4 }
                  }}>
                    <Box sx={{ mb: { xs: 1, sm: 2 }, color: theme.palette.primary.main }}>
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
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem', lg: '1.5rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' }
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

        {/* Call to Action - Drupal-like Footer Region */}
        <Box 
          sx={{ 
            bgcolor: theme.palette.grey[100],
            py: { xs: 3, sm: 4, md: 6, lg: 8 },
            textAlign: 'center',
            px: { xs: 1, sm: 2, md: 3 },
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="md">
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }
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
                px: { xs: 2, sm: 3, md: 4, lg: 5 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }
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