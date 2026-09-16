#!/bin/bash
# ==============================================================================
# RÉPUBLIQUE DU CAMEROUN - BUNEC
# Script Universel de Démarrage Rapide (Tous Éditeurs & Tous Navigateurs)
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3000
URL="http://localhost:$PORT"

echo "========================================================================"
echo "  BUNEC — SUIVI D'ÉTAT CIVIL & PUBLICATION LÉGALE DES BANS (CAMEROUN)    "
echo "========================================================================"

# 1. Vérification si le serveur tourne déjà sur le port 3000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "[INFO] Le serveur BUNEC tourne déjà sur $URL"
else
    echo "[INFO] Démarrage du serveur Node.js sur le port $PORT..."
    cd "$PROJECT_DIR"
    nohup node server.js > server.log 2>&1 &
    sleep 1
    echo "[OK] Serveur démarré avec succès en arrière-plan (PID: $!)."
fi

# 2. Affichage des coordonnées réseau pour test mobile
LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
if [ -n "$LOCAL_IP" ]; then
    echo "------------------------------------------------------------------------"
    echo "  ACCÈS SMARTPHONE (WI-FI LOCAL) : http://$LOCAL_IP:$PORT"
    echo "------------------------------------------------------------------------"
fi

# 3. Ouverture automatique du navigateur
echo "[INFO] Ouverture de la plateforme dans le navigateur..."
if which xdg-open > /dev/null 2>&1; then
    xdg-open "$URL" > /dev/null 2>&1 &
elif which firefox > /dev/null 2>&1; then
    firefox "$URL" > /dev/null 2>&1 &
elif which chromium > /dev/null 2>&1; then
    chromium "$URL" > /dev/null 2>&1 &
fi

echo "========================================================================"
echo "Plateforme prête ! URL locale : $URL"
echo "Pour simuler le format smartphone : bash $PROJECT_DIR/lancer_mobile.sh"
echo "========================================================================"
