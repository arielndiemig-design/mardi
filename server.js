const { startServer } = require("./backend/server");

startServer().catch((error) => {
  console.error("[BUNEC] Impossible de démarrer le serveur :", error);
  process.exitCode = 1;
});
