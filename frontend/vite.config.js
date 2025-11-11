import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/soroban-rpc": {
        target: "https://soroban-testnet.stellar.org",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log(
            "🔁 Rewriting path:",
            path,
            "→",
            path.replace(/^\/soroban-rpc/, "/soroban/rpc")
          );
          return path.replace(/^\/soroban-rpc/, "/soroban/rpc");
        },
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(
              "➡️  Proxying request:",
              req.url,
              "→",
              proxyReq.protocol + "//" + proxyReq.host + proxyReq.path
            );
          });
          proxy.on("error", (err, req, res) => {
            console.error("❌ Proxy error:", err);
          });
        },
      },
    },
  },
});
