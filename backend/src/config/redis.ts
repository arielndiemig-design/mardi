import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

export const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  retryStrategy(times) {
    // Reconnexion exponentielle jusqu'à 2 secondes max
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true
});

redisClient.on('connect', () => {
  console.log('[REDIS-BUNEC] Connexion établie au cluster de cache');
});

redisClient.on('error', (err) => {
  console.warn('[REDIS-BUNEC] Avertissement cache:', err.message);
});

export const CACHE_TTL = {
  BANS_ACTIFS: 300,        // 5 minutes pour les registres publics
  REFERENTIEL_GEO: 86400,  // 24 heures pour le référentiel des 10 régions
  DOSSIER_SUIVI: 60        // 1 minute pour un dossier fréquemment consulté
};
