import PrivateRoute from './Pages/PrivateRoute'; // Assure-toi d'importer le composant PrivateRoute  
import Connexion from './Authentification/Connexion';
import Inscription from './Authentification/Inscription';
import DashboardAdmin from './Pages/DashboardAdmin';
import DashboardEnseignant from './Pages/DashboardEnseignant';
import DashboardEtudiant from './Pages/DashboardEtudiant';
import SidebarAdmin from './Pages/SidebarAdmin';
import SidebarProfesseur from './Pages/SidebarProfesseur';
import SidebarEleve from './Pages/SidebarEleve';
import PageAjouterEleve from './Pages/PageAjouterEleve';
import ListeEleve from './Pages/ListeEleve';
import PageAjouterEnseignant from './Pages/PageAjouterEnseignant';
import ModifierEleve from './Pages/ModifierEleve';
import ModifierEnseignant from './Pages/ModifierEnseignant';
import ListeEnseignant from './Pages/ListeEnseignant';
import ListeEmploi from './Pages/ListeEmploi';
import Paiement from './Pages/Paiement';
import ListePaiement from './Pages/ListePaiement';
import ModifierPaiement from './Pages/ModifierPaiement';
import Cours from './Pages/Cours';
import EmploiEleve from './Pages/EmploiEleve';
import  CreerClasse  from './Pages/CreerClasse';
import  CreerMatiere  from './Pages/CreerMatiere';
import  Header  from './Pages/Header';
import  Accueil  from './Pages/Accueil';
import  Formation  from './Pages/Formation';
import  Note  from './Pages/Note';





import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  

function App() {  
    const userRole = localStorage.getItem('userRole'); // Obtention du rôle  


    return (  
        <Router>  
            <div style={{ display: 'flex' }}>  
                
                <div style={{ flexGrow: 1 }}>  
                    <Routes>  
                        <Route path="/" element={<Connexion />} />  
                        <Route path="/Inscription" element={<Inscription />} />  
                        <Route path="/Accueil" element={<Accueil />} />  
                        <Route path="/Formation" element={<Formation />} />  

                        {/* Utilisation de PrivateRoute avec enfant pour les routes protégées */}  
                        <Route path="/dashboardAdmin" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <DashboardAdmin />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/dashboardEnseignant" element={  
                            <PrivateRoute allowedRoles={['professeur']}>  
                                <DashboardEnseignant />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/dashboardEtudiant" element={  
                            <PrivateRoute allowedRoles={['eleve']}>  
                                <DashboardEtudiant />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/ajouterEleve" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <PageAjouterEleve />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/ajouterEnseignant" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <PageAjouterEnseignant />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/listeEleve" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <ListeEleve />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/ListeEnseignant" element={  
                            <PrivateRoute allowedRoles={['admin','eleve']}>  
                                <ListeEnseignant />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/ModifierEleve/:id" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <ModifierEleve />  
                            </PrivateRoute>  
                        } />  


                     <Route path="/CreerClasse" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <CreerClasse />  
                            </PrivateRoute>  
                        } />  
                        
                        

                        

                     <Route path="/Header" element={  
                            <PrivateRoute allowedRoles={['admin','eleve']}>  
                                <Header />  
                            </PrivateRoute>  
                        } />  


                        <Route path="/CreerMatiere" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <CreerMatiere />  
                            </PrivateRoute>  
                        } />  
                        

                        <Route path="/ModifierEnseignant/:id" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <ModifierEnseignant />  
                            </PrivateRoute>  
                        } />  
                       
                        <Route path="/ListeEmploi" element={  
                            <PrivateRoute allowedRoles={['eleve']}>  
                                <ListeEmploi />  
                            </PrivateRoute>  
                        } />  
                        

                        <Route path="/EmploiEleve" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <EmploiEleve />  
                            </PrivateRoute>  
                        } />  
                        



                        <Route path="/Note" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <Note />  
                            </PrivateRoute>  
                        } />  
                        

                        <Route path="/Paiement" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <Paiement />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/ListePaiement" element={  
                            <PrivateRoute allowedRoles={['admin', 'professeur','eleve']}>  
                                <ListePaiement />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/ModifierPaiement/:id" element={  
                            <PrivateRoute allowedRoles={['admin']}>  
                                <ModifierPaiement />  
                            </PrivateRoute>  
                        } />  
                        <Route path="/Cours" element={  
                            <PrivateRoute allowedRoles={['professeur', 'eleve']}>  
                                <Cours />  
                            </PrivateRoute>  
                        } />  

                            


                       
           
                  




                        <Route path="*" element={<Navigate to="/" />} />  
                    </Routes>  
                </div>  
            </div>  
        </Router>  
    );  
}  

export default App;