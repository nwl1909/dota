import { loadEnvFile } from "node:process";
import fs from "node:fs";

// .env есть только локально; в GitHub Actions его нет — это нормально
if (fs.existsSync(".env")) {
  loadEnvFile();
}

// Базовый путь сайта. Для GitHub Pages в подпапке (user.github.io/dota/) = "/dota/".
// Задаётся через переменную окружения BASE_PATH при сборке; локально = "/".
const rawBase = process.env.BASE_PATH || "/";
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

// В коде много путей вида "/assets/images/...". Подставляем в них base на этапе сборки.
const prefixAssetPaths = () => ({
  name: "prefix-asset-paths",
  enforce: "pre" as const,
  transform(code: string, id: string) {
    if (base === "/" || !/\/src\/.*\.(tsx?|jsx?|css)$/.test(id)) return null;
    const out = code.replace(/(["'`(])\/assets\//g, `$1${base}assets/`);
    return out === code ? null : { code: out, map: null };
  },
});

export default {
  base,
  plugins: [prefixAssetPaths()],
  build: {
    outDir: "build",
    // sourcemap: true,
  },
  server: {
    https:
      process.env.SSL_CRT_FILE && process.env.SSL_KEY_FILE
        ? {
            key: fs.readFileSync(process.env.SSL_KEY_FILE),
            cert: fs.readFileSync(process.env.SSL_CRT_FILE),
          }
        : null,
    allowedHosts: true,
  },
};
