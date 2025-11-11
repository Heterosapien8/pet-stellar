import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// ✅ Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Client-Name",
      "X-Client-Version",
    ],

    credentials: true,
  })
);


// ✅ Proxy configuration
app.use(
  "/soroban-rpc",
  createProxyMiddleware({
    target: "https://soroban-rpc.testnet.stellar.org/", // Soroban RPC endpoint
    changeOrigin: true,
    pathRewrite: { "^/soroban-rpc": "" },
    secure: false,
    logLevel: "debug",
    onProxyReq: (proxyReq, req) => {
      console.log(`➡️ Forwarding ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = "http://localhost:5173";
      proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
      proxyRes.headers["Access-Control-Allow-Headers"] =
        "Content-Type, Authorization";
      console.log(`✅ Response: ${proxyRes.statusCode} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error:", err.message);
      res.status(500).send("Proxy error: " + err.message);
    },
  })
);

// ✅ Preflight handling (fixed for Express 5)
app.options(/.*/, cors()); // <-- ✅ safe regex pattern

app.listen(8080, () => {
  console.log("🚀 Local proxy running at http://localhost:8080/soroban-rpc");
  console.log("📡 Forwarding to: https://soroban-rpc.testnet.stellar.org/");
});
