const path = require("node:path");
const fs = require("node:fs/promises");
const compression = require("compression");
const express = require("express");
const apiRouter = require("./routes/api");
const { checkRateLimit, setSecurityHeaders } = require("./middleware/security");

function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(compression());
  app.use((req, res, next) => {
    setSecurityHeaders(res, req);
    if (checkRateLimit(req, res)) return;

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    next();
  });
  app.use(apiRouter);
  app.use("/api", (req, res) => {
    res.status(404).json({ success: false, error: "Route API introuvable." });
  });

  return app;
}

async function attachFrontend(app, httpServer) {
  let viteServer = null;

  if (process.env.NODE_ENV === "production") {
    const frontendDirectory = path.resolve(__dirname, "../dist");
    app.use(express.static(frontendDirectory));
    app.get("*", (req, res, next) => {
      res.sendFile(path.join(frontendDirectory, "index.html"), (error) => {
        if (error) next(error);
      });
    });
  } else {
    const { createServer } = await import("vite");
    viteServer = await createServer({
      configFile: path.resolve(__dirname, "../vite.config.js"),
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: "spa",
    });
    app.get(["/", "/index.html"], async (req, res, next) => {
      try {
        const indexHtml = await fs.readFile(
          path.resolve(__dirname, "../public/index.html"),
          "utf8",
        );
        const html = await viteServer.transformIndexHtml(
          req.originalUrl,
          indexHtml,
        );
        res.status(200).type("html").send(html);
      } catch (error) {
        next(error);
      }
    });
    app.use(viteServer.middlewares);
  }

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const statusCode = error.statusCode || error.status || 500;
    res.status(statusCode).json({
      success: false,
      error:
        statusCode >= 500
          ? "Erreur interne du serveur."
          : error.message || "Requête invalide.",
    });
  });

  return viteServer;
}

module.exports = { attachFrontend, createApp };