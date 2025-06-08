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
  Button
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
        axios.get(`${API_URLS.eleves}?populate=classe`),
        axios.get(`${API_URLS.enseignants}?populate=matiere`),
        axios.get(`${API_URLS.notes}?populate=eleve,matiere`),
        axios.get(`${API_URLS.matieres}?populate=enseignants`)
      ]);
      
      setEleves(elevesRes.data);
      setEnseignants(enseignantsRes.data);
      setNotes(notesRes.data);
      setMatieres(matieresRes.data);
    } catch (error) {
      console.error('Erreur API:', error);
      setError('Erreur lors de la récupération des données');
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
      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.paper' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ fontWeight: 'bold' }}>
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id} hover>
                {columns.map((col) => (
                  <TableCell key={`${row._id}-${col.field}`}>
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
      
      <Box sx={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
        <SidebarAdmin />
        
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 3,
          ml: { sm: '240px' },
          width: { sm: 'calc(100% - 240px)' },
          overflowY: 'auto'
        }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1 }} />
            Tableau de bord
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Élèves" icon={<PeopleIcon />} />
            <Tab label="Enseignants" icon={<PeopleIcon />} />
            <Tab label="Matières" icon={<SubjectIcon />} />
            <Tab label="Notes" icon={<AssignmentIcon />} />
          </Tabs>

          <Divider sx={{ mb: 3 }} />

          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1 }} />
                Liste des Élèves
                <Chip label={`${eleves.length} inscrits`} size="small" sx={{ ml: 2 }} />
              </Typography>
              {renderTable(eleves, [
                { field: 'nom', headerName: 'Nom' },
                { field: 'prenom', headerName: 'Prénom' },
                { field: 'email', headerName: 'Email' },
                { 
                  field: 'classe', 
                  headerName: 'Classe', 
                  valueGetter: (row) => row.classe?.nom || 'Non attribué'
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
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1 }} />
                Liste des Enseignants
                <Chip label={`${enseignants.length} enseignants`} size="small" sx={{ ml: 2 }} />
              </Typography>
              {renderTable(enseignants, [
                { field: 'nom', headerName: 'Nom' },
                { field: 'prenom', headerName: 'Prénom' },
                { field: 'email', headerName: 'Email' },
                { 
                  field: 'matiere', 
                  headerName: 'Matière', 
                  valueGetter: (row) => row.matiere?.nom || 'Non assigné'
                }
              ])}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <SubjectIcon sx={{ mr: 1 }} />
                Liste des Matières
                <Chip label={`${matieres.length} matières`} size="small" sx={{ ml: 2 }} />
              </Typography>
              {renderTable(matieres, [
                { field: 'nom', headerName: 'Nom' },
                { field: 'coefficient', headerName: 'Coefficient' },
                { field: 'description', headerName: 'Description' },
                { 
                  field: 'enseignants', 
                  headerName: 'Enseignants', 
                  valueGetter: (row) => (
                    row.enseignants?.map(e => `${e.nom} ${e.prenom}`).join(', ') || 'Aucun'
                  )
                }
              ])}
            </Box>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Liste des Notes
                <Chip label={`${notes.length} notes`} size="small" sx={{ ml: 2 }} />
              </Typography>
              {renderTable(notes, [
                { 
                  field: 'eleve', 
                  headerName: 'Élève', 
                  valueGetter: (row) => `${row.eleve?.nom} ${row.eleve?.prenom}` || 'Inconnu' 
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