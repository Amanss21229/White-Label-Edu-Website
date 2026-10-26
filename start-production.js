import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(root, "FCFPSL-main");
const managementDir = path.join(root, "SLManagement-main");
const port = process.env.PORT || "5000";
const managementPort = process.env.MANAGEMENT_PORT || "5001";
const required = ["DATABASE_URL", "SESSION_SECRET", "ADMIN_PASSWORD", "MANAGER_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}
if (process.env.ADMIN_PASSWORD.length < 12 || process.env.MANAGER_PASSWORD.length < 12) {
  console.error("Set unique, strong ADMIN_PASSWORD and MANAGER_PASSWORD values (both must be at least 12 characters).");
  process.exit(1);
}
process.env.MANAGEMENT_INTERNAL_URL = `http://127.0.0.1:${managementPort}`;
process.env.PORT = port;
const py = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const management = spawn(py, ["-m", "gunicorn", "--workers", "2", "--threads", "4", "--timeout", "120", "--bind", `127.0.0.1:${managementPort}`, "main:app"], {
  cwd: managementDir, env: process.env, stdio: "inherit"
});
const web = spawn(process.execPath, ["dist/index.cjs"], { cwd: appDir, env: process.env, stdio: "inherit" });
let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  management.kill("SIGTERM"); web.kill("SIGTERM");
  setTimeout(() => process.exit(code), 1500).unref();
}
management.on("error", (e) => { console.error("Could not start management service:", e); shutdown(1); });
web.on("error", (e) => { console.error("Could not start registration service:", e); shutdown(1); });
management.on("exit", (code) => { if (!shuttingDown) { console.error(`Management service exited (${code}); stopping combined app.`); shutdown(code || 1); } });
web.on("exit", (code) => { if (!shuttingDown) { console.error(`Registration service exited (${code}); stopping combined app.`); shutdown(code || 1); } });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => shutdown(0));
console.log(`Starting combined white-label app. Public port=${port}; management is internal at 127.0.0.1:${managementPort}.`);
