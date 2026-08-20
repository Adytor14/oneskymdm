import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Loader2,
  MinusCircle,
  Play,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type CheckStatus = "pending" | "running" | "pass" | "fail" | "warn" | "skipped";

interface CheckResult {
  id: string;
  label: string;
  description: string;
  status: CheckStatus;
  detail?: string;
  durationMs?: number;
  hints?: string[];
}

const AUTH_BASE = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`;
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const NETWORK_HINTS = [
  "The request never reached the server (status 0). This is almost always local, not an account problem.",
  "Disable VPN / corporate proxy, or switch to another network such as a mobile hotspot.",
  "Open a private window with all extensions disabled (ad blockers and privacy shields block auth calls).",
  "Ask IT to allow the backend host used by this app if you are on a managed device.",
];

const STEPS: Array<Pick<CheckResult, "id" | "label" | "description">> = [
  { id: "browser", label: "Browser connectivity", description: "Is the browser reporting an online connection?" },
  { id: "app", label: "App server reachable", description: "Can the browser load resources from this app's own origin?" },
  { id: "dns", label: "Auth host reachable", description: "Does the auth service respond to a health request?" },
  { id: "cors", label: "CORS / preflight", description: "Is the browser allowed to talk to the auth service from this origin?" },
  { id: "settings", label: "Auth settings readable", description: "Does the auth service return its public configuration?" },
  { id: "storage", label: "Session storage", description: "Can the session be written to localStorage?" },
  { id: "clock", label: "Device clock", description: "Is this device's clock close to server time?" },
  { id: "session", label: "Existing session", description: "Is there a session already stored in this browser?" },
  { id: "signin", label: "Sign-in attempt", description: "Optional: attempt a real sign-in with credentials." },
];

const statusMeta: Record<CheckStatus, { icon: JSX.Element; badge: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { icon: <MinusCircle className="h-5 w-5 text-muted-foreground" />, badge: "Not run", variant: "outline" },
  running: { icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />, badge: "Running", variant: "secondary" },
  pass: { icon: <CheckCircle2 className="h-5 w-5 text-primary" />, badge: "Pass", variant: "default" },
  warn: { icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />, badge: "Warning", variant: "secondary" },
  fail: { icon: <XCircle className="h-5 w-5 text-destructive" />, badge: "Fail", variant: "destructive" },
  skipped: { icon: <MinusCircle className="h-5 w-5 text-muted-foreground" />, badge: "Skipped", variant: "outline" },
};

const withTimeout = (ms: number) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
};

const LoginDiagnostics = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<CheckResult[]>(
    STEPS.map((s) => ({ ...s, status: "pending" as CheckStatus })),
  );
  const [running, setRunning] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const update = useCallback((id: string, patch: Partial<CheckResult>) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const runStep = useCallback(
    async (id: string, fn: () => Promise<Partial<CheckResult>>) => {
      update(id, { status: "running", detail: undefined, hints: undefined, durationMs: undefined });
      const started = performance.now();
      try {
        const patch = await fn();
        update(id, { durationMs: Math.round(performance.now() - started), ...patch });
        return patch.status;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        update(id, {
          status: "fail",
          detail: message,
          durationMs: Math.round(performance.now() - started),
          hints: NETWORK_HINTS,
        });
        return "fail" as CheckStatus;
      }
    },
    [update],
  );

  const runDiagnostics = useCallback(async () => {
    setRunning(true);
    setResults(STEPS.map((s) => ({ ...s, status: "pending" as CheckStatus })));

    await runStep("browser", async () =>
      navigator.onLine
        ? { status: "pass", detail: "navigator.onLine reports an active connection." }
        : {
            status: "fail",
            detail: "The browser reports it is offline.",
            hints: ["Reconnect to Wi-Fi or mobile data, then run the diagnostics again."],
          },
    );

    await runStep("app", async () => {
      const t = withTimeout(8000);
      try {
        const res = await fetch(`${window.location.origin}/favicon.ico?diag=${Date.now()}`, {
          cache: "no-store",
          signal: t.signal,
        });
        return {
          status: res.ok || res.status === 404 ? "pass" : "warn",
          detail: `App origin responded with HTTP ${res.status}.`,
        };
      } finally {
        t.clear();
      }
    });

    const dnsStatus = await runStep("dns", async () => {
      const t = withTimeout(10000);
      try {
        const res = await fetch(`${AUTH_BASE}/health`, {
          headers: { apikey: API_KEY },
          cache: "no-store",
          signal: t.signal,
        });
        if (res.ok) {
          return { status: "pass", detail: `Auth service healthy (HTTP ${res.status}).` };
        }
        return {
          status: "fail",
          detail: `Auth service responded with HTTP ${res.status}.`,
          hints: [
            "The host is reachable but returned an error — this is a backend-side issue, not your network.",
            "Retry in a minute; if it persists the auth service may be degraded.",
          ],
        };
      } catch (error: unknown) {
        // Distinguish a network/DNS/firewall block from a browser- or CORS-level block:
        // an opaque no-cors probe succeeds whenever the host actually resolves and answers.
        const message = error instanceof Error ? error.message : String(error);
        let opaqueReached = false;
        const probe = withTimeout(8000);
        try {
          await fetch(`${AUTH_BASE}/health`, { mode: "no-cors", cache: "no-store", signal: probe.signal });
          opaqueReached = true;
        } catch {
          opaqueReached = false;
        } finally {
          probe.clear();
        }

        if (opaqueReached) {
          return {
            status: "fail",
            detail: `${message} — but an opaque probe did reach the host, so the connection exists and the response is being stripped before the app can read it.`,
            hints: [
              "A VPN, TLS-inspecting proxy, or security agent is rewriting the response so the browser rejects it.",
              "Disable the VPN / proxy for this site, or ask IT to exclude the backend host from TLS inspection.",
              "Privacy extensions (uBlock, Ghostery, Brave shields, DNS-level blockers) can do the same — retry in a clean private window.",
            ],
          };
        }

        return {
          status: "fail",
          detail: `${message} — the opaque probe also failed, so the request never reached the host at all (DNS or firewall block).`,
          hints: [
            "The backend host is not resolving or is being dropped at the network edge: this is a DNS/firewall block, not an account or app problem.",
            "Switch networks — a mobile hotspot is the fastest way to confirm; if sign-in works there, your office network is blocking the host.",
            "On a corporate network, ask IT to allow *.supabase.co over HTTPS (443) and exclude it from DNS filtering.",
            "Turn off any custom or filtering DNS (Pi-hole, NextDNS, 1.1.1.1 for Families) and flush the DNS cache.",
          ],
        };
      } finally {
        t.clear();
      }
    });

    if (dnsStatus !== "pass") {
      ["cors", "settings"].forEach((id) =>
        update(id, { status: "skipped", detail: "Skipped because the auth host could not be reached." }),
      );
    } else {
      await runStep("cors", async () => {
        const t = withTimeout(10000);
        try {
          const res = await fetch(`${AUTH_BASE}/token?grant_type=password`, {
            method: "POST",
            headers: { apikey: API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ email: "diagnostics@invalid.local", password: "diagnostics-probe" }),
            signal: t.signal,
          });
          return {
            status: "pass",
            detail: `Cross-origin POST to the token endpoint completed (HTTP ${res.status}). Credentials were intentionally invalid.`,
          };
        } finally {
          t.clear();
        }
      });

      await runStep("settings", async () => {
        const t = withTimeout(10000);
        try {
          const res = await fetch(`${AUTH_BASE}/settings`, {
            headers: { apikey: API_KEY },
            cache: "no-store",
            signal: t.signal,
          });
          if (!res.ok) {
            return { status: "warn", detail: `Settings endpoint returned HTTP ${res.status}.` };
          }
          const json = await res.json();
          const providers = Object.entries((json.external ?? {}) as Record<string, boolean>)
            .filter(([, on]) => on)
            .map(([name]) => name);
          return {
            status: "pass",
            detail: `Email sign-in ${json.disable_signup === true ? "restricted (signups disabled)" : "available"}. Enabled providers: ${
              providers.length ? providers.join(", ") : "none"
            }.`,
          };
        } finally {
          t.clear();
        }
      });
    }

    await runStep("storage", async () => {
      try {
        const probe = "__onesky_diag__";
        window.localStorage.setItem(probe, "1");
        window.localStorage.removeItem(probe);
        return { status: "pass", detail: "localStorage is writable, so sessions can persist." };
      } catch {
        return {
          status: "fail",
          detail: "localStorage is blocked in this browser context.",
          hints: [
            "Turn off strict privacy mode or \"block all cookies\" for this site.",
            "Private/incognito windows in some browsers block storage — try a normal window.",
          ],
        };
      }
    });

    await runStep("clock", async () => {
      const t = withTimeout(10000);
      try {
        const res = await fetch(`${AUTH_BASE}/health`, { headers: { apikey: API_KEY }, cache: "no-store", signal: t.signal });
        const serverDate = res.headers.get("date");
        if (!serverDate) return { status: "warn", detail: "Server time header unavailable; skipped clock comparison." };
        const skewSec = Math.abs(Date.now() - new Date(serverDate).getTime()) / 1000;
        if (skewSec > 120) {
          return {
            status: "fail",
            detail: `Device clock is off by about ${Math.round(skewSec)} seconds.`,
            hints: ["Enable automatic date & time on this device — large skew invalidates auth tokens immediately."],
          };
        }
        return { status: "pass", detail: `Clock skew is ${Math.round(skewSec)}s, within tolerance.` };
      } finally {
        t.clear();
      }
    });

    await runStep("session", async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return { status: "fail", detail: error.message, hints: NETWORK_HINTS };
      }
      if (!data.session) {
        return { status: "warn", detail: "No stored session — expected if you are signed out." };
      }
      const expires = data.session.expires_at ? new Date(data.session.expires_at * 1000).toLocaleString() : "unknown";
      return { status: "pass", detail: `Signed in as ${data.session.user.email ?? "unknown"}. Token expires ${expires}.` };
    });

    if (!email || !password) {
      update("signin", {
        status: "skipped",
        detail: "Enter an email and password above to test a real sign-in.",
      });
    } else {
      await runStep("signin", async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error) {
          return { status: "pass", detail: "Sign-in succeeded — credentials and network are both fine." };
        }
        const isNetwork = /failed to fetch|network|load failed/i.test(error.message) || error.status === 0;
        if (isNetwork) {
          return { status: "fail", detail: `Network failure: ${error.message}`, hints: NETWORK_HINTS };
        }
        if (error.status === 400) {
          return {
            status: "fail",
            detail: `Rejected by the auth service: ${error.message}`,
            hints: [
              "The request reached the server, so your network is fine — the credentials were rejected.",
              "Use the password reset flow if you are unsure of the password.",
              "If the email is unconfirmed, confirm it from the invitation/confirmation email first.",
            ],
          };
        }
        if (error.status === 429) {
          return {
            status: "fail",
            detail: `Rate limited: ${error.message}`,
            hints: ["Too many attempts in a short period. Wait a few minutes before retrying."],
          };
        }
        return {
          status: "fail",
          detail: `${error.status ?? ""} ${error.message}`.trim(),
          hints: ["The auth service returned an unexpected error. Retry shortly, then share this report."],
        };
      });
    }

    setRunning(false);
  }, [email, password, runStep, update]);

  const copyReport = async () => {
    const report = [
      `OneSky login diagnostics — ${new Date().toISOString()}`,
      `Origin: ${window.location.origin}`,
      `User agent: ${navigator.userAgent}`,
      "",
      ...results.map(
        (r) =>
          `[${statusMeta[r.status].badge}] ${r.label}${r.durationMs != null ? ` (${r.durationMs}ms)` : ""}${
            r.detail ? `\n    ${r.detail}` : ""
          }`,
      ),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(report);
      toast({ title: "Report copied", description: "Paste it into a support message." });
    } catch {
      toast({ title: "Copy failed", description: "Select the results manually instead.", variant: "destructive" });
    }
  };

  const failures = results.filter((r) => r.status === "fail");

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
          <span className="text-xl font-bold">OneSky</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login diagnostics</CardTitle>
            <CardDescription>
              Runs the same steps a sign-in takes and shows exactly where it breaks, plus what to change.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="diag-email">Email (optional)</Label>
                <Input
                  id="diag-email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diag-password">Password (optional)</Label>
                <Input
                  id="diag-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Credentials are used only for a live sign-in test from this browser and are never stored by the diagnostics.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={runDiagnostics} disabled={running}>
                {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                {running ? "Running checks..." : "Run diagnostics"}
              </Button>
              <Button variant="outline" onClick={copyReport} disabled={running}>
                <Copy className="mr-2 h-4 w-4" />
                Copy report
              </Button>
            </div>
          </CardContent>
        </Card>

        {failures.length > 0 && (
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertCircle className="h-5 w-5" />
                Sign-in fails at: {failures[0].label}
              </CardTitle>
              <CardDescription>{failures[0].detail}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {(failures[0].hints ?? NETWORK_HINTS).map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Checks</CardTitle>
            <CardDescription>Each step runs in the order a real sign-in depends on it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {results.map((result, index) => (
              <div key={result.id}>
                {index > 0 && <Separator />}
                <div className="flex items-start gap-3 py-4">
                  <div className="mt-0.5">{statusMeta[result.status].icon}</div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{result.label}</span>
                      <Badge variant={statusMeta[result.status].variant}>{statusMeta[result.status].badge}</Badge>
                      {result.durationMs != null && (
                        <span className="text-xs text-muted-foreground">{result.durationMs}ms</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.detail ?? result.description}</p>
                    {result.status === "fail" && result.hints && (
                      <ul className="list-disc space-y-1 pl-5 pt-1 text-sm text-muted-foreground">
                        {result.hints.map((hint) => (
                          <li key={hint}>{hint}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginDiagnostics;
