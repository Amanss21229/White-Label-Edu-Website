const base = (process.env.BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
const checks = [
  { name: "brand config API", path: "/api/brand", accept: (r, body) => r.ok && body.name && body.logoUrl },
  { name: "registration homepage", path: "/", accept: (r, body) => r.ok && body.includes("id=\"root\"") },
  { name: "management route", path: "/management", accept: (r) => r.status >= 200 && r.status < 400 },
  { name: "management login", path: "/management/login", accept: (r) => r.status >= 200 && r.status < 400 },
];
let failures = 0;
for (const check of checks) {
  try {
    const response = await fetch(`${base}${check.path}`, { redirect: "follow" });
    const raw = await response.text();
    let body = raw;
    if (check.path === "/api/brand") body = JSON.parse(raw);
    const passed = check.accept(response, body);
    console.log(`${passed ? "PASS" : "FAIL"} ${check.name} (${response.status})`);
    if (!passed) failures++;
  } catch (error) {
    console.error(`FAIL ${check.name}: ${error.message}`);
    failures++;
  }
}
if (failures) process.exit(1);
console.log("Smoke tests passed. This does not replace full feature/security/backup acceptance testing.");
