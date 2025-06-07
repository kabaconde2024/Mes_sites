import React, { useState } from 'react';  
import axios from 'axios';  
import SidebarAdmin from './SidebarAdmin';  
import { Box, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';  
import { useNavigate } from 'react-router-dom';  

const AjouterOffre = () => {  
    const [titre, setTitre] = useState('');  
    const [description, setDescription] = useState('');  
    const [error, setError] = useState('');  
    const navigate = useNavigate();  // Pour rediriger après l'ajout  

    const handleSubmit = async (e) => {  
        e.preventDefault();  

        // Valider les champs du formulaire  
        if (!titre || !description) {  
            setError('Tous les champs doivent être remplis.');  
            return;  
        }  

        const token = localStorage.getItem('token'); // Récupération du token  

        try {  
            await axios.post('https://mes-sites.onrender.com/api/offres/ajout', { titre, description }, {  
                headers: { Authorization: `Bearer ${token}` }, // Ajout du token dans les en-têtes  
            });  
            setTitre(''); // Réinitialiser le champ de titre  
            setDescription(''); // Réinitialiser le champ de description  
            setError('');  // Effacer les erreurs  
            alert('Offre ajoutée avec succès !');  
            navigate('/dashboardAdmin'); // Rediriger vers le tableau de bord après l'ajout  
        } catch (error) {  
            console.error('Erreur lors de l\'ajout de l\'offre:', error);  
            setError('Erreur lors de l\'ajout de l\'offre.');  
        }  
    };  

    return (  
        <Box sx={{ display: 'flex' }}>  
            <SidebarAdmin />  
            <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>  
                <Grid container spacing={3}>  
                    <Grid item xs={12}>  
                        <Card>  
                            <CardContent>  
                                <Typography variant="h5">Ajouter une Nouvelle Offre</Typography>  
                                {error && <Typography color="error">{error}</Typography>} {/* Afficher l'erreur si nécessaire */}  
                                <form onSubmit={handleSubmit}>  
                                    <Grid container spacing={3}>  
                                        <Grid item xs={12}>  
                                            <TextField  
                                                label="Titre de l'Offre"  
                                                value={titre}  
                                                onChange={(e) => setTitre(e.target.value)}  
                                                fullWidth  
                                                required  
                                            />  
                                        </Grid>  
                                        <Grid item xs={12}>  
                                            <TextField  
                                                label="Description"  
                                                value={description}  
                                                onChange={(e) => setDescription(e.target.value)}  
                                                fullWidth  
                                                multiline  
                                                rows={4}  
                                                required  
                                            />  
                                        </Grid>  
                                        <Grid item xs={12}>  
                                            <Button type="submit" variant="contained" color="primary" fullWidth>  
                                                Ajouter l'Offre  
                                            </Button>  
                                        </Grid>  
                                    </Grid>  
                                </form>  
                            </CardContent>  
                        </Card>  
                    </Grid>  
                </Grid>  
            </Box>  
        </Box>  
    );  
};  

export default AjouterOffre;