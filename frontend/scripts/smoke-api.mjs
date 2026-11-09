/**
 * Smoke-test Carevya Nest endpoints from OpenAPI.
 * Usage: node scripts/smoke-api.mjs
 * Optional: CAREVYA_SESSION_COOKIE="..." for authenticated checks
 */
const BASE =
  process.env.BACKEND_API_URL?.replace(/\/+$/, "") ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/+$/, "") ||
  "https://carevya-backend.onrender.com";

const COOKIE = process.env.CAREVYA_SESSION_COOKIE || "";

const results = [];

async function hit(method, path, { body, formData, expectAuth = false, label } = {}) {
  const url = `${BASE}${path}`;
  const headers = { Accept: "application/json" };
  if (COOKIE) headers.Cookie = COOKIE;
  if (body !== undefined && !formData) {
    headers["Content-Type"] = "application/json";
  }

  const init = { method, headers };
  if (formData) init.body = formData;
  else if (body !== undefined) init.body = JSON.stringify(body);

  const started = Date.now();
  let status = 0;
  let ok = false;
  let detail = "";
  try {
    const res = await fetch(url, init);
    status = res.status;
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* ignore */
    }
    const msg =
      (json && (json.message || json.error)) ||
      text.slice(0, 160).replace(/\s+/g, " ");
    detail = typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 160);

    if (expectAuth && !COOKIE) {
      // Unauthenticated probe: 401/403 means route exists and guards work.
      ok = status === 401 || status === 403;
      detail = ok
        ? `auth-guarded (${status})`
        : `expected 401/403 without cookie, got ${status}: ${detail}`;
    } else if (expectAuth && COOKIE) {
      ok = status >= 200 && status < 300;
    } else {
      ok = status >= 200 && status < 300;
    }
  } catch (err) {
    detail = err instanceof Error ? err.message : String(err);
    ok = false;
  }

  const row = {
    ok,
    method,
    path,
    label: label || path,
    status,
    ms: Date.now() - started,
    detail,
  };
  results.push(row);
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${method.padEnd(6)} ${path}  [${status}] ${detail}`);
  return row;
}

async function main() {
  console.log(`Base: ${BASE}`);
  console.log(`Cookie: ${COOKIE ? "provided" : "none (auth routes probed for 401/403)"}`);
  console.log("");

  // --- Public / system ---
  await hit("GET", "/", { label: "welcome" });
  await hit("GET", "/health", { label: "health" });
  await hit("GET", "/waitlist/stats", { label: "waitlist stats" });

  // Waitlist join — use a unique throwaway email so we don't spam a real inbox repeatedly
  const stamp = Date.now();
  await hit("POST", "/waitlist", {
    label: "waitlist join",
    body: {
      role: "care_seeker",
      fullName: "API Smoke Test",
      email: `smoke+${stamp}@example.com`,
      phone: "08031234567",
      state: "Lagos",
      lga: "Ikeja",
    },
  });

  await hit("POST", "/newsletter/subscribe", {
    label: "newsletter",
    body: { email: `smoke+news+${stamp}@example.com` },
  });

  await hit("POST", "/contact", {
    label: "contact",
    body: {
      firstName: "Smoke",
      lastName: "Test",
      email: `smoke+contact+${stamp}@example.com`,
      subject: "API smoke test",
      message: "This is an automated smoke test message from the frontend repo.",
      phone: "+2348031234567",
    },
  });

  // --- Auth (Better Auth) — public-ish probes ---
  await hit("GET", "/api/auth/ok", { label: "auth ok" });
  await hit("GET", "/api/auth/get-session", { label: "get-session" });
  await hit("POST", "/api/auth/sign-in/email", {
    label: "sign-in email (bad creds)",
    body: { email: "nobody@example.com", password: "WrongPass1" },
  });
  // Expect failure for bad creds — treat 4xx as PASS for reachability
  const last = results[results.length - 1];
  if (!last.ok && last.status >= 400 && last.status < 500) {
    last.ok = true;
    last.detail = `reachable (${last.status}): ${last.detail}`;
    console.log(
      `NOTE  adjusted sign-in probe → PASS (endpoint reachable with ${last.status})`,
    );
  }

  await hit("POST", "/api/auth/sign-up/email", {
    label: "sign-up email shape",
    body: {
      email: `smoke+signup+${stamp}@example.com`,
      password: "SmokeTest1!",
      name: "Smoke Test",
    },
  });

  // --- Authenticated Nest modules ---
  const authPaths = [
    ["GET", "/onboarding/careseeker"],
    ["GET", "/onboarding/careseeker/summary"],
    ["PUT", "/onboarding/careseeker/steps/1"],
    ["POST", "/onboarding/careseeker/review"],
    ["POST", "/onboarding/careseeker/complete"],
    ["GET", "/care-recipients"],
    ["POST", "/care-recipients"],
    ["GET", "/care-recipients/00000000-0000-0000-0000-000000000001"],
    ["PATCH", "/care-recipients/00000000-0000-0000-0000-000000000001"],
    ["DELETE", "/care-recipients/00000000-0000-0000-0000-000000000001"],
    ["GET", "/care-recipients/00000000-0000-0000-0000-000000000001/overview"],
    ["GET", "/care-recipients/00000000-0000-0000-0000-000000000001/health"],
    ["PUT", "/care-recipients/00000000-0000-0000-0000-000000000001/health"],
    ["GET", "/care-recipients/00000000-0000-0000-0000-000000000001/care-plan"],
    ["PUT", "/care-recipients/00000000-0000-0000-0000-000000000001/care-plan"],
    [
      "GET",
      "/care-recipients/00000000-0000-0000-0000-000000000001/emergency-contacts",
    ],
    [
      "PUT",
      "/care-recipients/00000000-0000-0000-0000-000000000001/emergency-contacts",
    ],
    [
      "DELETE",
      "/care-recipients/00000000-0000-0000-0000-000000000001/emergency-contacts/00000000-0000-0000-0000-000000000002",
    ],
    ["GET", "/care-recipients/00000000-0000-0000-0000-000000000001/history"],
    ["GET", "/dashboard"],
    ["GET", "/dashboard/appointments"],
    ["GET", "/dashboard/recommended"],
    ["POST", "/uploads"],
  ];

  for (const [method, path] of authPaths) {
    const body =
      method === "PUT" || method === "PATCH" || method === "POST"
        ? path.includes("/steps/1")
          ? { careRecipientType: "self" }
          : path.includes("/emergency-contacts") && method === "PUT"
            ? {
                contacts: [
                  {
                    name: "Smoke Contact",
                    relationship: "Son",
                    phone: "08031234567",
                  },
                ],
              }
            : path.includes("/health")
              ? { conditions: ["Hypertension"], mobility: "walks_on_own" }
              : path.includes("/care-plan")
                ? { careTypes: ["companion"], arrangement: "live_in" }
                : path === "/care-recipients"
                  ? {
                      fullName: "Smoke Recipient",
                      relationship: "mother",
                      gender: "female",
                      dateOfBirth: "1955-04-12",
                      languages: ["English"],
                    }
                  : path === "/uploads"
                    ? undefined
                    : {}
        : undefined;

    if (path === "/uploads" && method === "POST") {
      // Without multipart file, expect 400/401 — both prove route is up
      const row = await hit(method, path, {
        expectAuth: true,
        body: {},
        label: "uploads (no file)",
      });
      if (!row.ok && (row.status === 400 || row.status === 415 || row.status === 401)) {
        row.ok = true;
        row.detail = `reachable (${row.status}): ${row.detail}`;
        console.log(`NOTE  adjusted uploads probe → PASS`);
      }
      continue;
    }

    // GET recipient by id isn't in swagger list as bare GET /{id} — skip if 404/405 without cookie after auth check
    if (
      method === "GET" &&
      /^\/care-recipients\/[0-9a-f-]+$/.test(path)
    ) {
      // OpenAPI has no bare GET /care-recipients/{id}; probe still useful
      await hit(method, path, { expectAuth: true, body });
      continue;
    }

    await hit(method, path, { expectAuth: true, body });
  }

  // Auth management probes (session required)
  const authMgmt = [
    ["POST", "/api/auth/change-password", { currentPassword: "x", newPassword: "y" }],
    ["POST", "/api/auth/update-user", { name: "Smoke" }],
    ["POST", "/api/auth/delete-user", {}],
    ["GET", "/api/auth/list-sessions", null],
    ["GET", "/api/auth/list-accounts", null],
    ["POST", "/api/auth/email-otp/send-verification-otp", { email: `smoke+otp+${stamp}@example.com`, type: "email-verification" }],
    ["POST", "/api/auth/email-otp/request-password-reset", { email: `smoke+otp+${stamp}@example.com` }],
  ];

  for (const [method, path, body] of authMgmt) {
    const row = await hit(method, path, {
      body: body ?? undefined,
      expectAuth: !path.includes("email-otp"),
      label: path,
    });
    // OTP send endpoints may succeed or rate-limit; 2xx/4xx both mean alive
    if (
      path.includes("email-otp") &&
      !row.ok &&
      row.status >= 400 &&
      row.status < 500
    ) {
      row.ok = true;
      row.detail = `reachable (${row.status}): ${row.detail}`;
      console.log(`NOTE  adjusted ${path} → PASS`);
    }
    if (
      path.includes("change-password") ||
      path.includes("update-user") ||
      path.includes("delete-user") ||
      path.includes("list-")
    ) {
      if (!row.ok && (row.status === 401 || row.status === 403 || row.status === 400 || row.status === 422)) {
        row.ok = true;
        row.detail = `reachable (${row.status}): ${row.detail}`;
        console.log(`NOTE  adjusted ${path} → PASS`);
      }
    }
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log("");
  console.log(`Summary: ${passed}/${results.length} passed`);
  if (failed.length) {
    console.log("Failures:");
    for (const f of failed) {
      console.log(`  - ${f.method} ${f.path} [${f.status}] ${f.detail}`);
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
