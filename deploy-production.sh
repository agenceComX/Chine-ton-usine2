#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT PRODUCTION FIREBASE
# Chine Ton Usine - Déploiement automatisé sécurisé

set -e # Arrêter le script en cas d'erreur

echo "🏭 =========================================="
echo "   DÉPLOIEMENT PRODUCTION FIREBASE"
echo "   Chine Ton Usine - Version 1.0.0"
echo "=========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Variables
PROJECT_DIR=$(pwd)
BUILD_DIR="dist"
FIREBASE_PROJECT="chine-ton-usine-2c999"

# Vérifications préliminaires
check_requirements() {
    log "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
        exit 1
    fi
    success "Node.js: $(node --version)"
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        error "npm n'est pas installé"
        exit 1
    fi
    success "npm: $(npm --version)"
    
    # Vérifier Firebase CLI
    if ! command -v firebase &> /dev/null; then
        warning "Firebase CLI non trouvé, installation..."
        npm install -g firebase-tools
    fi
    success "Firebase CLI: $(firebase --version)"
    
    # Vérifier la connexion Firebase
    log "Vérification de la connexion Firebase..."
    if ! firebase projects:list &> /dev/null; then
        error "Non connecté à Firebase. Exécutez: firebase login"
        exit 1
    fi
    success "Connecté à Firebase"
}

# Nettoyage et installation des dépendances
install_dependencies() {
    log "Installation des dépendances..."
    
    # Nettoyer node_modules et package-lock.json
    if [ -d "node_modules" ]; then
        log "Nettoyage de node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        rm -f package-lock.json
    fi
    
    # Installation fraîche des dépendances
    npm install
    success "Dépendances installées"
}

# Build de l'application
build_application() {
    log "Construction de l'application pour la production..."
    
    # Définir les variables d'environnement de production
    export NODE_ENV=production
    export VITE_FIREBASE_PROJECT_ID="chine-ton-usine-2c999"
    export VITE_FIREBASE_AUTH_DOMAIN="chine-ton-usine-2c999.firebaseapp.com"
    
    # Nettoyer le dossier de build précédent
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
    fi
    
    # Build de production
    npm run build
    
    # Vérifier que le build a réussi
    if [ ! -d "$BUILD_DIR" ]; then
        error "Échec du build - dossier $BUILD_DIR non trouvé"
        exit 1
    fi
    
    success "Application construite dans $BUILD_DIR"
    
    # Afficher la taille du build
    if command -v du &> /dev/null; then
        BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
        log "Taille du build: $BUILD_SIZE"
    fi
}

# Validation des fichiers critiques
validate_build() {
    log "Validation du build..."
    
    # Vérifier les fichiers critiques
    CRITICAL_FILES=(
        "$BUILD_DIR/index.html"
        "firebase.json"
        "firestore.rules"
    )
    
    for file in "${CRITICAL_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            error "Fichier critique manquant: $file"
            exit 1
        fi
    done
    
    # Vérifier la configuration Firebase
    if ! grep -q "hosting" firebase.json; then
        error "Configuration hosting manquante dans firebase.json"
        exit 1
    fi
    
    # Vérifier les règles Firestore
    if ! grep -q "rules_version = '2'" firestore.rules; then
        error "Règles Firestore invalides"
        exit 1
    fi
    
    success "Build validé"
}

# Déploiement des règles Firestore
deploy_firestore_rules() {
    log "Déploiement des règles Firestore..."
    
    # Déployer les règles
    firebase deploy --only firestore:rules --project "$FIREBASE_PROJECT"
    success "Règles Firestore déployées"
}

# Déploiement de l'hosting
deploy_hosting() {
    log "Déploiement de l'application web..."
    
    # Déployer l'hosting
    firebase deploy --only hosting --project "$FIREBASE_PROJECT"
    success "Application web déployée"
}

# Test post-déploiement
test_deployment() {
    log "Tests post-déploiement..."
    
    # Obtenir l'URL de déploiement
    HOSTING_URL="https://${FIREBASE_PROJECT}.web.app"
    
    log "URL de production: $HOSTING_URL"
    
    # Test de base avec curl si disponible
    if command -v curl &> /dev/null; then
        if curl -s --head "$HOSTING_URL" | head -n 1 | grep -q "200 OK"; then
            success "Site accessible à $HOSTING_URL"
        else
            warning "Impossible de vérifier l'accessibilité du site"
        fi
    fi
}

# Sauvegarde des informations de déploiement
save_deployment_info() {
    log "Sauvegarde des informations de déploiement..."
    
    DEPLOYMENT_INFO="deployment-info-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$DEPLOYMENT_INFO" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "project": "$FIREBASE_PROJECT",
  "hosting_url": "https://${FIREBASE_PROJECT}.web.app",
  "build_dir": "$BUILD_DIR",
  "node_version": "$(node --version)",
  "npm_version": "$(npm --version)",
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'N/A')",
  "git_branch": "$(git branch --show-current 2>/dev/null || echo 'N/A')"
}
EOF
    
    success "Informations sauvegardées dans $DEPLOYMENT_INFO"
}

# Affichage du résumé final
show_summary() {
    log "Résumé du déploiement..."
    
    echo ""
    echo "🎉 ========================================"
    echo "   DÉPLOIEMENT RÉUSSI !"
    echo "========================================"
    echo ""
    echo "📍 URL de production: https://${FIREBASE_PROJECT}.web.app"
    echo "📍 Console Firebase: https://console.firebase.google.com/project/${FIREBASE_PROJECT}"
    echo ""
    echo "🔐 Prochaines étapes:"
    echo "  1. Testez la connexion admin sur /login"
    echo "  2. Créez les utilisateurs de production"
    echo "  3. Configurez votre domaine personnalisé"
    echo "  4. Activez le monitoring"
    echo ""
    echo "🛡️  Sécurité:"
    echo "  • Règles Firestore strictes déployées"
    echo "  • Headers de sécurité configurés"
    echo "  • SSL/TLS activé automatiquement"
    echo ""
    echo "📧 Support: support@chinetonusine.com"
    echo "========================================"
}

# Fonction principale
main() {
    log "Démarrage du déploiement..."
    
    # Demander confirmation
    echo ""
    warning "⚠️  ATTENTION: Déploiement en PRODUCTION"
    echo ""
    echo "Cette opération va:"
    echo "• Construire l'application en mode production"
    echo "• Déployer sur Firebase Hosting"
    echo "• Appliquer les règles Firestore strictes"
    echo "• Rendre l'application accessible publiquement"
    echo ""
    read -p "Continuer? (y/N): " confirm
    
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        warning "Déploiement annulé"
        exit 0
    fi
    
    # Exécution des étapes
    check_requirements
    install_dependencies
    build_application
    validate_build
    deploy_firestore_rules
    deploy_hosting
    test_deployment
    save_deployment_info
    show_summary
    
    success "Déploiement terminé avec succès !"
}

# Gestion des erreurs
trap 'error "Erreur lors du déploiement. Consultez les logs ci-dessus."; exit 1' ERR

# Exécution
main "$@"
