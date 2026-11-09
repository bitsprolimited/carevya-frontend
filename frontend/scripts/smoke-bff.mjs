const APP = process.env.APP_URL || "http://localhost:3010";
const stamp = Date.now();
const results = [];

async function hit(method, path, body) {
  const headers = { Accept: "application/json", Origin: APP };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  try {
    const res = await fetch(`${APP}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* ignore */
    }
    const ok = res.status >= 200 && res.status < 300;
    results.push({ ok, method, path, status: res.status });
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${method.padEnd(6)} ${path}  [${res.status}] ${JSON.stringify(json ?? text).slice(0, 160)}`,
    );
  } catch (err) {
    results.push({ ok: false, method, path, status: 0 });
    console.log(`FAIL  ${method.padEnd(6)} ${path}  [ERR] ${err.message}`);
  }
}

async function waitReady() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${APP}/api/health`);
      if (res.status) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  console.log(`App: ${APP}`);
  const ready = await waitReady();
  if (!ready) {
    console.log("FAIL  server not ready");
    process.exit(1);
  }

  await hit("GET", "/api/health");
  await hit("GET", "/api/waitlist/stats");
  await hit("POST", "/api/waitlist", {
    role: "care_seeker",
    fullName: "BFF Smoke",
    email: `bff+${stamp}@example.com`,
    phone: "08031234567",
    state: "Lagos",
    lga: "Ikeja",
  });
  await hit("POST", "/api/newsletter", { email: `bff+news+${stamp}@example.com` });
  await hit("POST", "/api/contact", {
    firstName: "BFF",
    lastName: "Smoke",
    email: `bff+contact+${stamp}@example.com`,
    subject: "BFF smoke",
    message: "Testing Next.js contact proxy to Nest.",
  });
  await hit("GET", "/api/auth/ok");
  await hit("GET", "/api/auth/get-session");

  // BFF backend proxy — expect 401 without session
  for (const path of [
    "/api/backend/onboarding/careseeker",
    "/api/backend/care-recipients",
    "/api/backend/dashboard",
    "/api/backend/dashboard/appointments",
    "/api/backend/dashboard/recommended",
    "/api/backend/health",
  ]) {
    const res = await fetch(`${APP}${path}`, {
      headers: { Accept: "application/json", Origin: APP },
    });
    const text = await res.text();
    const ok =
      path.endsWith("/health")
        ? res.status === 200
        : res.status === 401 || res.status === 403;
    results.push({ ok, method: "GET", path, status: res.status });
    console.log(
      `${ok ? "PASS" : "FAIL"}  GET    ${path}  [${res.status}] ${text.slice(0, 120)}`,
    );
  }

  const passed = results.filter((r) => r.ok).length;
  console.log("");
  console.log(`Summary: ${passed}/${results.length} passed`);
  if (results.some((r) => !r.ok)) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
