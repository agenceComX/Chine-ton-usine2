// Script pour forcer le rechargement et voir les modifications
console.log('🔄 Forçage du rechargement...');

// Supprimer le cache du navigateur
if ('caches' in window) {
    caches.keys().then(names => {
        names.forEach(name => {
            caches.delete(name);
        });
    });
}

// Recharger la page
setTimeout(() => {
    window.location.reload(true);
}, 1000);
