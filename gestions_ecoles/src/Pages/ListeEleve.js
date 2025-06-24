import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';
import Header from './Header';

const ListeEleve = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [eleves, setEleves] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const fetchEleves = async () => {  
  const token = localStorage.getItem('token');  
  try {  
    const response = await axios.get("https://mes-sites.onrender.com/api/eleves", {  
      headers: {  
        Authorization: `Bearer ${token}`,  
      },  
    });
    
    // Vérifiez la structure de la réponse
    const receivedData = response.data?.data || response.data;
    
    if (!Array.isArray(receivedData)) {
      throw new Error('Format de données inattendu');
    }
    
    setEleves(receivedData);
    setError('');
    
  } catch (error) {  
    console.error('Erreur:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });  
    setError(error.response?.data?.message || error.message);  
  }  
};
  // Fonction pour supprimer un élève
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    console.log('ID à supprimer:', id);
    if (id && window.confirm('Voulez-vous vraiment supprimer cet élève ?')) {
        try {
            await axios.delete(`https://mes-sites.onrender.com/api/eleves/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEleves(eleves.filter((eleve) => eleve._id !== id));
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            setError('Erreur lors de la suppression de l\'élève.');
        }
    } else {
        console.error('ID invalide pour la suppression');
    }
  };

  // Redirection vers la page de modification
  const handleEdit = (id) => {
    navigate(`/ModifierEleve/${id}`);
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      pt: { xs: '56px', sm: '64px' },
      bgcolor: '#f5f5f5'
    }}>
      <Header />
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%'
      }}>
        <SidebarAdmin />
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: { xs: 0, sm: theme.shape.borderRadius },
                boxShadow: { xs: 'none', sm: theme.shadows[3] },
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                  <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
                  >
                    Liste des Élèves
                  </Typography>
                  {error && (
                    <Typography 
                      color="error" 
                      sx={{ 
                        mb: 2, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {error}
                    </Typography>
                  )}
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      maxHeight: { xs: '60vh', sm: '70vh' }, 
                      overflowX: 'auto'
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            p: { xs: 1, sm: 2 }
                          }}>
                            Nom
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            p: { xs: 1, sm: 2 },
                            display: { xs: 'none', sm: 'table-cell' }
                          }}>
                            Prénom
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            p: { xs: 1, sm: 2 }
                          }}>
                            Email
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            p: { xs: 1, sm: 2 },
                            display: { xs: 'none', md: 'table-cell' }
                          }}>
                            Téléphone
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            p: { xs: 1, sm: 2 },
                            display: { xs: 'none', sm: 'table-cell' }
                          }}>
                            Classe
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            p: { xs: 1, sm: 2 }
                          }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {eleves.map((eleve) => (
                          <TableRow key={eleve._id}>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              p: { xs: 1, sm: 2 }
                            }}>
                              {isMobile ? `${eleve.nom} ${eleve.prenom}` : eleve.nom}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              p: { xs: 1, sm: 2 },
                              display: { xs: 'none', sm: 'table-cell' }
                            }}>
                              {eleve.prenom}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              p: { xs: 1, sm: 2 }
                            }}>
                              {eleve.email}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              p: { xs: 1, sm: 2 },
                              display: { xs: 'none', md: 'table-cell' }
                            }}>
                              {eleve.telephone}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              p: { xs: 1, sm: 2 },
                              display: { xs: 'none', sm: 'table-cell' }
                            }}>
                              {eleve.classe}
                            </TableCell>
                            <TableCell sx={{ 
                              p: { xs: 1, sm: 2 },
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: { xs: 1, sm: 1 }
                            }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEdit(eleve._id)}
                                size={isMobile ? 'small' : 'medium'}
                                sx={{ 
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  minWidth: { xs: '100%', sm: 'auto' }
                                }}
                              >
                                Modifier
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(eleve._id)}
                                size={isMobile ? 'small' : 'medium'}
                                sx={{ 
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  minWidth: { xs: '100%', sm: 'auto' }
                                }}
                              >
                                Supprimer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ListeEleve;