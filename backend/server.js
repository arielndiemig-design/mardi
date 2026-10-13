const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const http = require("node:http");
const { attachFrontend, createApp } = require("./app");
const { closeDatabase } = require("./database/pool");

async function startServer() {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error("PORT doit être un numéro de port valide.");
  }

  const app = createApp();
  const httpServer = http.createServer(app);
  const viteServer = await attachFrontend(app, httpServer);
  httpServer.on("close", () => {
    if (viteServer) viteServer.close().catch((error) => console.error(error));
    closeDatabase().catch((error) => console.error(error));
  });

  await new Promise((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, "0.0.0.0", resolve);
  });

  const address = httpServer.address();
  console.log(`[BUNEC] Plateforme active sur http://localhost:${address.port}`);
  console.log("[BUNEC] API Express et frontend Vite partagent ce serveur HTTP.");
  return httpServer;
}

module.exports = { startServer };