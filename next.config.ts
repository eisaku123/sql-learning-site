import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  turbopack: {
    resolveAlias: {
      "sql.js": "./node_modules/sql.js/dist/sql-wasm.js",
    },
  },
};

export default nextConfig;
