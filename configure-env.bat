@echo off
echo Configuration des variables d'environnement Firebase
echo.

REM Remplacez ces valeurs par vos vraies valeurs Firebase
set FIREBASE_PROJECT_ID=chine-ton-usine
set FIREBASE_PRIVATE_KEY_ID=VOTRE_PRIVATE_KEY_ID
set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com
set FIREBASE_CLIENT_ID=VOTRE_CLIENT_ID

echo Variables configurees !
echo.
echo Pour tester : node test-firebase-config.mjs
echo Pour creer les utilisateurs : node create-new-production-users.mjs
pause