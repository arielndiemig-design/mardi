# ==============================================================================
# BUNEC — Dockerfile de Déploiement Souverain
# Image ultra-légère basée sur Alpine Linux (Node.js LTS)
# ==============================================================================
FROM node:20-alpine

LABEL maintainer="BUNEC Cameroun <contact@bunec.cm>"
LABEL description="Plateforme Souveraine de Suivi d'État Civil et Publication des Bans"

WORKDIR /app

# Copie des fichiers de configuration et code source
COPY package.json ./
COPY server.js ./
COPY public ./public
COPY database ./database
COPY docs ./docs

# Sécurisation par utilisateur système non-root
RUN addgroup -S bunec && adduser -S bunec -G bunec && chown -R bunec:bunec /app
USER bunec

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Contrôle d'état de santé du conteneur (Healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/v1/referentiel/cameroun || exit 1

CMD ["node", "server.js"]
