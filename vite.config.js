const path = require("node:path");
const fs = require("node:fs");

function htmlPartials() {
  const partialDirectory = path.resolve(__dirname, "public/frontend");

  return {
    name: "bunec-html-partials",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(/<!-- partial:([a-z0-9-]+) -->/g, (_, name) => {
          const partialPath = path.join(partialDirectory, `${name}.html`);
          if (!partialPath.startsWith(`${partialDirectory}${path.sep}`)) {
            throw new Error(`Partiel HTML invalide: ${name}`);
          }
          return fs.readFileSync(partialPath, "utf8");
        });
      },
    },
  };
}

function preserveDynamicImages() {
  const imageRoot = path.resolve(__dirname, "public/images");

  return {
    name: "preserve-dynamic-images",
    apply: "build",
    generateBundle() {
      const emitDirectory = (directory) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          const entryPath = path.join(directory, entry.name);
          if (entry.isDirectory()) {
            emitDirectory(entryPath);
          } else if (entry.isFile()) {
            const relativePath = path.relative(imageRoot, entryPath);
            this.emitFile({
              type: "asset",
              fileName: path.posix.join(
                "images",
                relativePath.split(path.sep).join("/"),
              ),
              source: fs.readFileSync(entryPath),
            });
          }
        }
      };

      if (fs.existsSync(imageRoot)) emitDirectory.call(this, imageRoot);

      const tailwindConfig = path.resolve(
        __dirname,
        "public/src/tailwind.config.js",
      );
      if (fs.existsSync(tailwindConfig)) {
        this.emitFile({
          type: "asset",
          fileName: "src/tailwind.config.js",
          source: fs.readFileSync(tailwindConfig),
        });
      }
    },
  };
}

module.exports = {
  root: path.resolve(__dirname, "public"),
  publicDir: false,
  plugins: [htmlPartials(), preserveDynamicImages()],
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
};