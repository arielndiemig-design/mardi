#!/bin/bash
# ==============================================================================
# RÉPUBLIQUE DU CAMEROUN - BUNEC
# Simulateur Mobile Tactile (Format Smartphone 412x915)
# ==============================================================================

PORT=3000
URL="http://localhost:$PORT"
USER_AGENT="Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36"

echo "========================================================================"
echo "  BUNEC — SIMULATEUR SMARTPHONE MOBILE (412 x 915)"
echo "========================================================================"

if which chromium > /dev/null 2>&1; then
    chromium --user-agent="$USER_AGENT" \
             --window-size=412,915 \
             --window-position=200,50 \
             --app="$URL" > /dev/null 2>&1 &
    echo "[OK] Fenêtre mobile Chromium lancée !"
elif which google-chrome > /dev/null 2>&1; then
    google-chrome --user-agent="$USER_AGENT" \
                  --window-size=412,915 \
                  --window-position=200,50 \
                  --app="$URL" > /dev/null 2>&1 &
    echo "[OK] Fenêtre mobile Google Chrome lancée !"
elif which firefox > /dev/null 2>&1; then
    firefox --width 412 --height 915 "$URL" > /dev/null 2>&1 &
    echo "[OK] Fenêtre mobile Firefox lancée !"
else
    xdg-open "$URL" > /dev/null 2>&1 &
fi
