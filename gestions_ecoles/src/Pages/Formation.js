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
  Chip,
  Divider
} from '@mui/material';
import { 
  School, 
  Groups, 
  LibraryBooks, 
  ContactMail,
  ArrowForward,
  CalendarToday,
  Schedule,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Formation = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const formations = [
    {
      title: "Licence en Informatique",
      description: "Formation complète en développement logiciel et systèmes d'information.",
      duration: "3 ans",
      schedule: "Temps plein",
      location: "Campus Principal",
      tags: ["Informatique", "Développement", "Réseaux"]
    },
    {
      title: "Master en Management",
      description: "Programme d'excellence en gestion d'entreprise et leadership.",
      duration: "2 ans",
      schedule: "Soir et week-end",
      location: "Campus Affaires",
      tags: ["Management", "Gestion", "Entrepreneuriat"]
    },
    {
      title: "BTS en Comptabilité",
      description: "Formation technique en gestion financière et comptable.",
      duration: "2 ans",
      schedule: "Temps plein",
      location: "Campus Economie",
      tags: ["Comptabilité", "Finance", "Gestion"]
    },
    {
      title: "Licence en Droit",
      description: "Programme fondamental en sciences juridiques et politiques.",
      duration: "3 ans",
      schedule: "Temps plein",
      location: "Campus Droit",
      tags: ["Droit", "Jurisprudence", "Sciences Politiques"]
    }
  ];

  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1, pt: 8 }}>
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
              Nos Formations
            </Typography>
            <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
              Découvrez notre offre de formation complète et adaptée au marché
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              endIcon={<ContactMail />}
              onClick={() => navigate('/contact')}
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Demander des informations
            </Button>
          </Container>
        </Box>

        {/* Formations List */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
            Programmes Disponibles
          </Typography>
          
          <Grid container spacing={4}>
            {formations.map((formation, index) => (
              <Grid item xs={12} md={6} key={index}>
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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {formation.title}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      {formation.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">{formation.duration}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">{formation.schedule}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">{formation.location}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formation.tags.map((tag, tagIndex) => (
                        <Chip 
                          key={tagIndex} 
                          label={tag} 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
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
              Vous hésitez sur votre orientation ?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '700px', margin: '0 auto' }}>
              Nos conseillers pédagogiques sont à votre disposition pour vous guider dans votre choix de formation.
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
              Prendre rendez-vous
            </Button>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Formation;