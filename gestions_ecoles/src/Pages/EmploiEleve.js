import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "./SidebarAdmin";
import { CircularProgress, Alert } from "@mui/material";
import Header from "./Header";
const EmploiEleve = () => {
    const [schedule, setSchedule] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [newSeance, setNewSeance] = useState({ 
        day: "Lundi", 
        time: "08:15-09:30", 
        subject: "",
        teacherId: ""
    });
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
        fetchTeachers();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await axios.get(
                "https://mes-sites.onrender.com/api/emploi/listes", 
                getAuthHeaders()
            );
            setSchedule(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des séances", error);
            setError("Erreur lors de la récupération des séances");
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        }
    };

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "https://mes-sites.onrender.com/api/enseignants/listes", 
                getAuthHeaders()
            );
            setTeachers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des enseignants", error);
            setError("Erreur lors de la récupération des enseignants");
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewSeance({ ...newSeance, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newSeance.day || !newSeance.time || !newSeance.subject || !newSeance.teacherId) {
            setError("Veuillez remplir tous les champs");
            return;
        }
    
        try {
            const [horaire_debut, horaire_fin] = newSeance.time.split('-');
            
            const dataToSend = {
                jour: newSeance.day,
                horaire_debut,
                horaire_fin,
                matiere: newSeance.subject,
                enseignantId: newSeance.teacherId
            };
    
            console.log("Données envoyées:", dataToSend);
    
            const response = await axios.post(
                "https://mes-sites.onrender.com/api/emploi/creer", 
                dataToSend,
                getAuthHeaders()
            );
    
            console.log("Réponse du serveur:", response.data);
    
            fetchSchedule();
            setNewSeance({ 
                day: "Lundi", 
                time: "08:15-09:30", 
                subject: "",
                teacherId: ""
            });
            setError("");
        } catch (error) {
            console.error("Erreur détaillée:", {
                message: error.message,
                response: error.response?.data,
                config: error.config
            });
            setError(`Erreur: ${error.response?.data?.message || error.message}`);
        }
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `https://mes-sites.onrender.com/api/emploi/${id}/supprimer`,
                getAuthHeaders()
            );
            fetchSchedule();
        } catch (error) {
            console.error("Erreur lors de la suppression", error);
            setError("Erreur lors de la suppression");
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex' }}>
                <SidebarAdmin />
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
        <div style={{ display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)' }}>
                  <Header />  
            <SidebarAdmin />
            <div style={{ flex: 1, padding: '32px' }}>
                <h1>Emploi du Temps</h1>
                
                {error && (
                    <Alert severity="error" style={{ marginBottom: '20px' }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} style={{ 
                    marginBottom: '30px',
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                }}>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '15px',
                        marginBottom: '15px'
                    }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Jour: </label>
                            <select
                                name="day"
                                value={newSeance.day}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            >
                                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Horaire: </label>
                            <select
                                name="time"
                                value={newSeance.time}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            >
                                {["08:15-09:30", "09:35-10:50", "10:55-12:10", "12:15-13:30", "13:35-14:50", "14:55-16:10"].map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Matière: </label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Matière"
                                value={newSeance.subject}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Enseignant: </label>
                            <select
                                name="teacherId"
                                value={newSeance.teacherId}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            >
                                <option value="">Sélectionnez un enseignant</option>
                                {teachers.map(teacher => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.nom} {teacher.prenom} ({teacher.matiere})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Ajouter la séance
                    </button>
                </form>

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
                                                            <div style={{ color: '#555', fontSize: '0.9em' }}>
                                                                {seance.enseignant?.nom} {seance.enseignant?.prenom}
                                                            </div>
                                                            <button
                                                                onClick={() => handleDelete(seance._id)}
                                                                style={{
                                                                    marginTop: '5px',
                                                                    padding: '5px 10px',
                                                                    backgroundColor: '#f44336',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '3px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.8em'
                                                                }}
                                                            >
                                                                Supprimer
                                                            </button>
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

export default EmploiEleve;