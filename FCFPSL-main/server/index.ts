import express, { type Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.get("/api/brand", (_req, res) => {
  res.json({
    name: process.env.BRAND_NAME || "Your Institute",
    tagline: process.env.BRAND_TAGLINE || "Learning for every student",
    logoUrl: process.env.BRAND_LOGO_URL || "/branding/logo.png",
    primaryColor: process.env.BRAND_PRIMARY_COLOR || "#D4AF37",
    contactPhone: process.env.BRAND_CONTACT_PHONE || "",
    contactAddress: process.env.BRAND_CONTACT_ADDRESS || "",
    programName: process.env.PROGRAM_NAME || "Student Registration Program",
    locationQrUrl: process.env.BRAND_LOCATION_QR_URL || "",
    locationMapsUrl: process.env.BRAND_LOCATION_MAPS_URL || "",
    socialLinks: {
      whatsapp: process.env.BRAND_WHATSAPP_URL || "",
      youtube: process.env.BRAND_YOUTUBE_URL || "",
      instagram: process.env.BRAND_INSTAGRAM_URL || "",
      telegram: process.env.BRAND_TELEGRAM_URL || "",
    },
    heroMedia: (() => { try { return JSON.parse(process.env.BRAND_HERO_MEDIA || "[]"); } catch { return []; } })(),
  });
});
app.use("/management", createProxyMiddleware({
  target: process.env.MANAGEMENT_INTERNAL_URL || "http://127.0.0.1:5001",
  changeOrigin: true, pathRewrite: { "^/management": "" },
  on: { proxyReq: (proxyReq) => proxyReq.setHeader("X-Script-Name", "/management") }
}));

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "5mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ limit: "5mb", extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
