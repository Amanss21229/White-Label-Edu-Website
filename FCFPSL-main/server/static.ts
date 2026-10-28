import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) throw new Error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  app.use(express.static(distPath, { index: false, maxAge: "1h" }));
  app.get("/{*path}", (_req, res) => {
    const file = path.join(distPath, "index.html");
    let html = fs.readFileSync(file, "utf8");
    const brand = {
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
    };
    const config = `window.__BRAND_CONFIG__ = ${JSON.stringify(brand).replace(/</g, "\\u003c")};`;
    html = html.replace(/window\.__BRAND_CONFIG__\s*=\s*\{[^;]*\};?/, config);
    html = html.replace(/<title>.*?<\/title>/i, `<title>${brand.name.replace(/[<>]/g, "")}</title>`);
    html = html.replace(/href="\/favicon\.png"/g, `href="${brand.logoUrl.replace(/"/g, "")}"`);
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(html);
  });
}
