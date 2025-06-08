import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarEleve from "./SidebarEleve";
import { CircularProgress, Alert } from "@mui/material";

const ListeEmploi = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fonction pour obtenir les en-têtes d'authentification
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Aucun token trouvé dans le localStorage");
            setError("Session expirée, veuillez vous reconnecter");
            return {};
        }
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "https://mes-sites.onrender.com/api/emploi/listes", 
                getAuthHeaders()
            );
            setSchedule(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des séances", error);
            setError("Erreur lors de la récupération des emplois du temps");
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex' }}>
                <SidebarEleve />
                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <CircularProgress />
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            <SidebarEleve />
            <div style={{ flex: 1, padding: '20px' }}>
                <h1>Emploi du Temps</h1>
                
                {error && (
                    <Alert severity="error" style={{ marginBottom: '20px' }}>
                        {error}
                    </Alert>
                )}

                <div style={{ 
                    overflowX: 'auto',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <table style={{ 
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{ 
                                backgroundColor: '#f2f2f2',
                                textAlign: 'left'
                            }}>
                                <th style={{ padding: '12px 15px' }}>Heure</th>
                                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(day => (
                                    <th key={day} style={{ padding: '12px 15px' }}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {["08:15-09:30", "09:35-10:50", "10:55-12:10", "12:15-13:30", "13:35-14:50", "14:55-16:10"].map(time => {
                                const [start, end] = time.split('-');
                                return (
                                    <tr key={time} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px 15px' }}>{time}</td>
                                        {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(day => {
                                            const seance = schedule.find(s => 
                                                s.jour === day && 
                                                s.horaire_debut === start && 
                                                s.horaire_fin === end
                                            );
                                            return (
                                                <td key={`${day}-${time}`} style={{ padding: '12px 15px' }}>
                                                    {seance ? (
                                                        <div>
                                                            <div style={{ fontWeight: 'bold' }}>{seance.matiere}</div>
                                                            {seance.enseignant?.nom && (
                                                                <div style={{ color: '#555', fontSize: '0.9em' }}>
                                                                    {seance.enseignant.nom} {seance.enseignant.prenom}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div style={{ color: '#999' }}>-</div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListeEmploi;