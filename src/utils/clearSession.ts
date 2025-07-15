/**
 * Utilitaire pour nettoyer complètement toutes les données de session
 * À utiliser en cas de problème de connexion permanente
 */

export const clearAllUserData = () => {
    try {
        // Nettoyer localStorage
        const keysToRemove = [
            'demoUser',
            'user',
            'authToken',
            'lastLogin',
            'userPreferences',
            'sessionData',
            'firebaseAuth',
            'persist:root'
        ];

        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });

        // Nettoyer sessionStorage
        sessionStorage.clear();

        // Nettoyer les cookies liés à l'authentification
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        console.log('✅ Toutes les données utilisateur ont été nettoyées');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage des données:', error);
        return false;
    }
};

export const forceLogout = async () => {
    // Nettoyer toutes les données
    clearAllUserData();

    // Rediriger vers la page d'accueil
    window.location.href = '/';
};

// Fonction à appeler si l'utilisateur reste connecté malgré la déconnexion
export const emergencyLogout = () => {
    if (window.confirm('⚠️ DÉCONNEXION D\'URGENCE ⚠️\n\nCeci va nettoyer toutes les données de session et vous rediriger vers la page d\'accueil.\n\nContinuer ?')) {
        forceLogout();
    }
};
