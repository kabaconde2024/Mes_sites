import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  Chip,
  Alert,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Subject as SubjectIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import SidebarAdmin from './SidebarAdmin';
import axios from 'axios';
import Header from './Header';

const DashboardAdmin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [eleves, setEleves] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [notes, setNotes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const API_URLS = {
    eleves: "https://mes-sites.onrender.com/api/eleves",
    enseignants: "https://mes-sites.onrender.com/api/enseignants/listes",
    notes: "https://mes-sites.onrender.com/api/notes",
    matieres: "https://mes-sites.onrender.com/api/matieres"
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [elevesRes, enseignantsRes, notesRes, matieresRes] = await Promise.all([
        axios.get(API_URLS.eleves, { params: { populate: 'classe' } }),
        axios.get(API_URLS.enseignants, { params: { populate: 'matiere' } }),
        axios.get(API_URLS.notes, { params: { populate: 'eleve,matiere' } }),
        axios.get(API_URLS.matieres, { params: { populate: 'enseignants' } })
      ]);
      
      // Modification ici pour gérer les différentes structures de réponse
      setEleves(elevesRes.data?.data || elevesRes.data || []);
      setEnseignants(enseignantsRes.data?.data || enseignantsRes.data || []);
      setNotes(notesRes.data?.data || notesRes.data || []);
      setMatieres(matieresRes.data?.data || matieresRes.data || []);
    } catch (error) {
      console.error('Erreur API:', error);
      setError('Erreur lors de la récupération des données');
      
      if (error.response) {
        console.error('Détails erreur:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTable = (data, columns) => {
    if (loading) return <LinearProgress />;
    if (error) return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={fetchAllData} startIcon={<RefreshIcon />}>
          Réessayer
        </Button>
      }>
        {error}
      </Alert>
    );
    if (!data || data.length === 0) return (
      <Alert severity="info">
        Aucune donnée disponible
      </Alert>
    );

    return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 2, 
          boxShadow: 3,
          maxWidth: '100%',
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            padding: { xs: '4px', sm: '8px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }
        }}
      >
        <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
          <TableHead sx={{ bgcolor: 'background.paper' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.field} 
                  sx={{ 
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    display: { 
                      xs: col.field === 'email' || col.field === 'statut' ? 'table-cell' : 'none',
                      sm: 'table-cell'
                    }
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id || row.id} hover>
                {columns.map((col) => (
                  <TableCell 
                    key={`${row._id || row.id}-${col.field}`}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: isMobile ? '120px' : 'none',
                      display: { 
                        xs: col.field === 'email' || col.field === 'statut' ? 'table-cell' : 'none',
                        sm: 'table-cell'
                      }
                    }}
                  >
                    {col.valueGetter ? col.valueGetter(row) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        pt: { xs: '56px', sm: '64px' }, 
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' } 
      }}>
        <SidebarAdmin />
        
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 },
          ml: { sm: '240px' },
          width: { sm: 'calc(100% - 240px)' },
          overflowY: 'auto'
        }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ 
            mb: { xs: 2, sm: 4 }, 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <SchoolIcon sx={{ mr: 1 }} />
            Tableau de bord
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={isMobile ? "Élèves" : "Liste des Élèves"} icon={<PeopleIcon />} />
            <Tab label={isMobile ? "Enseignants" : "Liste des Enseignants"} icon={<PeopleIcon />} />
            <Tab label={isMobile ? "Matières" : "Liste des Matières"} icon={<SubjectIcon />} />
            <Tab label={isMobile ? "Notes" : "Liste des Notes"} icon={<AssignmentIcon />} />
          </Tabs>

          <Divider sx={{ mb: 3 }} />

          {tabValue === 0 && (
            <Box>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <PeopleIcon sx={{ mr: 1 }} />
                Liste des Élèves
                <Chip 
                  label={`${eleves.length} inscrits`} 
                  size="small" 
                  sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }} 
                />
              </Typography>
              {renderTable(eleves, [
                { field: 'nom', headerName: 'Nom' },
                { field: 'prenom', headerName: 'Prénom' },
                { field: 'email', headerName: 'Email' },
                { 
                  field: 'classe', 
                  headerName: 'Classe', 
                  valueGetter: (row) => {
                    // Gestion des différentes structures de réponse
                    if (Array.isArray(row.classe)) {
                      return row.classe.length > 0 
                        ? row.classe.map(c => c.nom).join(', ') 
                        : 'Non attribué';
                    }
                    return row.classe?.nom || 'Non attribué';
                  }
                },
                { 
                  field: 'statut', 
                  headerName: 'Statut', 
                  valueGetter: (row) => (
                    <Chip 
                      label={row.statut === 'actif' ? 'Actif' : 'Inactif'} 
                      color={row.statut === 'actif' ? 'success' : 'error'} 
                      size="small" 
                    />
                  )
                }
              ])}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <PeopleIcon sx={{ mr: 1 }} />
                Liste des Enseignants
                <Chip 
                  label={`${enseignants.length} enseignants`} 
                  size="small" 
                  sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }} 
                />
              </Typography>
              {renderTable(enseignants, [
                { field: 'nom', headerName: 'Nom' },
                { field: 'prenom', headerName: 'Prénom' },
                { field: 'email', headerName: 'Email' },
                { 
                  field: 'matiere', 
                  headerName: 'Matières', 
                  valueGetter: (row) => {
                    // Gestion des différentes structures de réponse
                    if (Array.isArray(row.matiere)) {
                      return row.matiere.length > 0 
                        ? row.matiere.map(m => m.nom).join(', ') 
                        : 'Non assigné';
                    }
                    return row.matiere?.nom || row.matiere || 'Non assigné';
                  }
                },
                { field: 'telephone', headerName: 'Téléphone' }
              ])}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <SubjectIcon sx={{ mr: 1 }} />
                Liste des Matières
                <Chip 
                  label={`${matieres.length} matières`} 
                  size="small" 
                  sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }} 
                />
              </Typography>
              {renderTable(matieres, [
                { field: 'nom', headerName: 'Nom' },
                { field: 'coefficient', headerName: 'Coefficient' },
                { field: 'description', headerName: 'Description' },
                { 
                  field: 'enseignants', 
                  headerName: 'Enseignants', 
                  valueGetter: (row) => {
                    if (Array.isArray(row.enseignants)) {
                      return row.enseignants.length > 0
                        ? row.enseignants.map(e => `${e.nom} ${e.prenom}`).join(', ')
                        : 'Aucun';
                    }
                    return 'Aucun';
                  }
                }
              ])}
            </Box>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Liste des Notes
                <Chip 
                  label={`${notes.length} notes`} 
                  size="small" 
                  sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }} 
                />
              </Typography>
              {renderTable(notes, [
                { 
                  field: 'eleve', 
                  headerName: 'Élève', 
                  valueGetter: (row) => {
                    if (row.eleve) {
                      return `${row.eleve.nom} ${row.eleve.prenom}`;
                    }
                    return 'Inconnu';
                  }
                },
                { 
                  field: 'matiere', 
                  headerName: 'Matière', 
                  valueGetter: (row) => row.matiere?.nom || 'Inconnue'
                },
                { 
                  field: 'valeur', 
                  headerName: 'Note', 
                  valueGetter: (row) => (
                    <Box sx={{ 
                      fontWeight: 'bold',
                      color: row.valeur >= 10 ? 'success.main' : 'error.main'
                    }}>
                      {row.valeur}/20
                    </Box>
                  )
                }
              ])}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardAdmin;