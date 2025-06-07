// PrivateRoute.js  
import React from 'react';  
import { Route, Navigate } from 'react-router-dom';  

const PrivateRoute = ({ children, allowedRoles }) => {  
    const user = JSON.parse(sessionStorage.getItem('user')); // Récupère l'utilisateur du sessionStorage  

    // Vérifie si l'utilisateur est authentifié et a un rôle autorisé  
    const hasAccess = user && allowedRoles.includes(user.role);  
    
    // Si l'utilisateur a accès, retourne les enfants, sinon redirige vers la page d'accueil  
    return hasAccess ? children : <Navigate to="/" />;  
};  

export default PrivateRoute;