# 🚀 SCRIPT DE DÉPLOIEMENT PRODUCTION FIREBASE (PowerShell)
# Chine Ton Usine - Déploiement automatisé sécurisé

param(
    [switch]$Force,
    [string]$ProjectId = "chine-ton-usine-2c999"
)

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Couleurs pour les messages
function Write-ColorText {
    param(
        [string]$Text,
        [string]$Color = "White"
    )
    Write-Host $Text -ForegroundColor $Color
}

function Write-Success { Write-ColorText "✅ $args" -Color Green }
function Write-Warning { Write-ColorText "⚠️  $args" -Color Yellow }
function Write-Error { Write-ColorText "❌ $args" -Color Red }
function Write-Info { Write-ColorText "[$(Get-Date -Format 'HH:mm:ss')] $args" -Color Blue }

# Bannière de démarrage
Write-Host ""
Write-ColorText "🏭 ==========================================" -Color Cyan
Write-ColorText "   DÉPLOIEMENT PRODUCTION FIREBASE" -Color Cyan
Write-ColorText "   Chine Ton Usine - Version 1.0.0" -Color Cyan
Write-ColorText "==========================================" -Color Cyan
Write-Host ""

# Variables globales
$ProjectDir = Get-Location
$BuildDir = "dist"
$FirebaseProject = $ProjectId

# Vérifications préliminaires
function Test-Requirements {
    Write-Info "Vérification des prérequis..."
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js: $nodeVersion"
    }
    catch {
        Write-Error "Node.js n'est pas installé"
        exit 1
    }
    
    # Vérifier npm
    try {
        $npmVersion = npm --version
        Write-Success "npm: $npmVersion"
    }
    catch {
        Write-Error "npm n'est pas installé"
        exit 1
    }
    
    # Vérifier Firebase CLI
    try {
        $firebaseVersion = firebase --version
        Write-Success "Firebase CLI: $firebaseVersion"
    }
    catch {
        Write-Warning "Firebase CLI non trouvé, installation..."
        npm install -g firebase-tools
        Write-Success "Firebase CLI installé"
    }
    
    # Vérifier la connexion Firebase
    Write-Info "Vérification de la connexion Firebase..."
    try {
        firebase projects:list | Out-Null
        Write-Success "Connecté à Firebase"
    }
    catch {
        Write-Error "Non connecté à Firebase. Exécutez: firebase login"
        exit 1
    }
}

# Installation des dépendances
function Install-Dependencies {
    Write-Info "Installation des dépendances..."
    
    # Nettoyer node_modules et package-lock.json
    if (Test-Path "node_modules") {
        Write-Info "Nettoyage de node_modules..."
        Remove-Item -Recurse -Force "node_modules"
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
    }
    
    # Installation fraîche des dépendances
    npm install
    Write-Success "Dépendances installées"
}

# Build de l'application
function Build-Application {
    Write-Info "Construction de l'application pour la production..."
    
    # Définir les variables d'environnement de production
    $env:NODE_ENV = "production"
    $env:VITE_FIREBASE_PROJECT_ID = $FirebaseProject
    $env:VITE_FIREBASE_AUTH_DOMAIN = "$FirebaseProject.firebaseapp.com"
    
    # Nettoyer le dossier de build précédent
    if (Test-Path $BuildDir) {
        Remove-Item -Recurse -Force $BuildDir
    }
    
    # Build de production
    npm run build
    
    # Vérifier que le build a réussi
    if (-not (Test-Path $BuildDir)) {
        Write-Error "Échec du build - dossier $BuildDir non trouvé"
        exit 1
    }
    
    Write-Success "Application construite dans $BuildDir"
    
    # Afficher la taille du build
    $buildSize = (Get-ChildItem -Recurse $BuildDir | Measure-Object -Property Length -Sum).Sum
    $buildSizeMB = [math]::Round($buildSize / 1MB, 2)
    Write-Info "Taille du build: $buildSizeMB MB"
}

# Validation du build
function Test-Build {
    Write-Info "Validation du build..."
    
    # Vérifier les fichiers critiques
    $criticalFiles = @(
        "$BuildDir\index.html",
        "firebase.json",
        "firestore.rules"
    )
    
    foreach ($file in $criticalFiles) {
        if (-not (Test-Path $file)) {
            Write-Error "Fichier critique manquant: $file"
            exit 1
        }
    }
    
    # Vérifier la configuration Firebase
    $firebaseConfig = Get-Content "firebase.json" -Raw
    if (-not ($firebaseConfig -match "hosting")) {
        Write-Error "Configuration hosting manquante dans firebase.json"
        exit 1
    }
    
    # Vérifier les règles Firestore
    $firestoreRules = Get-Content "firestore.rules" -Raw
    if (-not ($firestoreRules -match "rules_version = '2'")) {
        Write-Error "Règles Firestore invalides"
        exit 1
    }
    
    Write-Success "Build validé"
}

# Déploiement des règles Firestore
function Deploy-FirestoreRules {
    Write-Info "Déploiement des règles Firestore..."
    
    firebase deploy --only firestore:rules --project $FirebaseProject
    Write-Success "Règles Firestore déployées"
}

# Déploiement de l'hosting
function Deploy-Hosting {
    Write-Info "Déploiement de l'application web..."
    
    firebase deploy --only hosting --project $FirebaseProject
    Write-Success "Application web déployée"
}

# Test post-déploiement
function Test-Deployment {
    Write-Info "Tests post-déploiement..."
    
    $hostingUrl = "https://$FirebaseProject.web.app"
    Write-Info "URL de production: $hostingUrl"
    
    # Test de base avec Invoke-WebRequest
    try {
        $response = Invoke-WebRequest -Uri $hostingUrl -Method Head -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Site accessible à $hostingUrl"
        }
    }
    catch {
        Write-Warning "Impossible de vérifier l'accessibilité du site"
    }
}

# Sauvegarde des informations de déploiement
function Save-DeploymentInfo {
    Write-Info "Sauvegarde des informations de déploiement..."
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $deploymentInfoFile = "deployment-info-$timestamp.json"
    
    # Obtenir les informations Git si disponible
    try {
        $gitCommit = git rev-parse HEAD
        $gitBranch = git branch --show-current
    }
    catch {
        $gitCommit = "N/A"
        $gitBranch = "N/A"
    }
    
    $deploymentInfo = @{
        timestamp          = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        project            = $FirebaseProject
        hosting_url        = "https://$FirebaseProject.web.app"
        build_dir          = $BuildDir
        node_version       = (node --version)
        npm_version        = (npm --version)
        git_commit         = $gitCommit
        git_branch         = $gitBranch
        powershell_version = $PSVersionTable.PSVersion.ToString()
    } | ConvertTo-Json -Depth 3
    
    $deploymentInfo | Out-File -FilePath $deploymentInfoFile -Encoding UTF8
    Write-Success "Informations sauvegardées dans $deploymentInfoFile"
}

# Affichage du résumé final
function Show-Summary {
    Write-Info "Résumé du déploiement..."
    
    Write-Host ""
    Write-ColorText "🎉 ========================================" -Color Green
    Write-ColorText "   DÉPLOIEMENT RÉUSSI !" -Color Green
    Write-ColorText "========================================" -Color Green
    Write-Host ""
    Write-Host "📍 URL de production: https://$FirebaseProject.web.app"
    Write-Host "📍 Console Firebase: https://console.firebase.google.com/project/$FirebaseProject"
    Write-Host ""
    Write-Host "🔐 Prochaines étapes:"
    Write-Host "  1. Testez la connexion admin sur /login"
    Write-Host "  2. Créez les utilisateurs de production"
    Write-Host "  3. Configurez votre domaine personnalisé"
    Write-Host "  4. Activez le monitoring"
    Write-Host ""
    Write-Host "🛡️  Sécurité:"
    Write-Host "  • Règles Firestore strictes déployées"
    Write-Host "  • Headers de sécurité configurés"
    Write-Host "  • SSL/TLS activé automatiquement"
    Write-Host ""
    Write-Host "📧 Support: support@chinetonusine.com"
    Write-ColorText "========================================" -Color Green
}

# Fonction principale
function Main {
    Write-Info "Démarrage du déploiement..."
    
    # Demander confirmation si pas de force
    if (-not $Force) {
        Write-Host ""
        Write-Warning "⚠️  ATTENTION: Déploiement en PRODUCTION"
        Write-Host ""
        Write-Host "Cette opération va:"
        Write-Host "• Construire l'application en mode production"
        Write-Host "• Déployer sur Firebase Hosting"
        Write-Host "• Appliquer les règles Firestore strictes"
        Write-Host "• Rendre l'application accessible publiquement"
        Write-Host ""
        
        $confirm = Read-Host "Continuer? (y/N)"
        if ($confirm -notmatch '^[Yy]$') {
            Write-Warning "Déploiement annulé"
            exit 0
        }
    }
    
    try {
        # Exécution des étapes
        Test-Requirements
        Install-Dependencies
        Build-Application
        Test-Build
        Deploy-FirestoreRules
        Deploy-Hosting
        Test-Deployment
        Save-DeploymentInfo
        Show-Summary
        
        Write-Success "Déploiement terminé avec succès !"
    }
    catch {
        Write-Error "Erreur lors du déploiement: $($_.Exception.Message)"
        Write-Host ""
        Write-Host "Consultez les logs ci-dessus pour plus de détails."
        exit 1
    }
}

# Gestion des interruptions
$global:OriginalErrorActionPreference = $ErrorActionPreference

# Exécution
try {
    Main
}
catch {
    Write-Error "Erreur critique: $($_.Exception.Message)"
    exit 1
}
finally {
    $ErrorActionPreference = $global:OriginalErrorActionPreference
}
