import React, { useEffect, useState } from 'react';  
import { io } from 'socket.io-client';  
import axios from 'axios';  
import SidebarAdmin from './SidebarAdmin';  
import { Box, Button } from '@mui/material';  
import SidebarEleve from './SidebarEleve';

const ListesOffre = () => {  
    const [offres, setOffres] = useState([]);  

    useEffect(() => {  
        const fetchOffers = async () => {
            const token = localStorage.getItem('token'); // Récupérer le token d'authentification
            if (!token) {
                alert('Vous devez être connecté pour voir les offres.');
                return;
            }
        
            try {
                const response = await axios.get('http://localhost:5000/api/offres/recuperer', {
                    headers: {
                        Authorization: `Bearer ${token}` // Ajouter le token dans les en-têtes
                    }
                });
                setOffres(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des offres:', error);
            }
        };
        

        fetchOffers();  

        // Connexion au serveur Socket.IO  
        const socket = io('http://localhost:5000');  

        // Écouter les événements  
        socket.on('nouvelleOffre', (offre) => {  
            setOffres((prevOffres) => [...prevOffres, offre]); // Ajouter la nouvelle offre à la liste  
        });  

        socket.on('offreSupprimee', (offreId) => {  
            setOffres((prevOffres) => prevOffres.filter(offre => offre._id !== offreId)); // Supprimer l'offre de la liste  
        });  

        return () => {  
            socket.disconnect(); // Déconnexion lorsque le composant est démonté  
        };  
    }, []);  

  const handlePostuler = async (offreId) => {
    const nomEleve = "Nom de l'élève"; // Remplace par les données de l'utilisateur connecté
    const emailEleve = "email@exemple.com"; // Idem, récupère depuis le contexte/auth
    const token = localStorage.getItem('token'); // Récupérer le token d'authentification

    try {
        await axios.post('http://localhost:5000/api/candidatures/postuler', 
            { offreId, nomEleve, emailEleve }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Candidature envoyée !");
    } catch (error) {
        console.error("Erreur lors de la postulation :", error);
    }
};


    return (  
        <Box sx={{ display: 'flex' }}>  
            <SidebarEleve/>  
            <div style={{ padding: '20px' }}>  
                <h1>Liste des offres</h1>  
                <ul>  
                    {offres.map((offre) => (  
                        <li key={offre._id} style={{ marginBottom: '10px' }}>  
                            <h3>{offre.titre}</h3>  
                            <p>{offre.description}</p>  
                            <Button variant="contained" color="primary" onClick={() => handlePostuler(offre._id)}>  
                                Postuler  
                            </Button>  
                        </li>  
                    ))}  
                </ul>  
            </div>  
        </Box>  
    );  
};  

export default ListesOffre;