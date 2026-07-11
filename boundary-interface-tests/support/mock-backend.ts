import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { authUsers, createDatabase, type MockDatabase } from "./data";

type Row = Record<string, unknown>;
type Failure = { table: string; method: string; message?: string };

let database = createDatabase();
let failures: Failure[] = [];
let sequence = 100;

const portFlag = process.argv.indexOf("--port");
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : 54329);

function json(
  res: ServerResponse,
  status: number,
  value: unknown,
  extra: Record<string, string> = {},
) {
  res.writeHead(status, { "content-type": "application/json", ...extra });
  res.end(JSON.stringify(value));
}

function cors(res: ServerResponse) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader(
    "access-control-allow-headers",
    "accept-profile, authorization, apikey, content-profile, content-type, prefer, x-client-info, x-supabase-api-version, x-upsert",
  );
  res.setHeader("access-control-allow-methods", "GET, HEAD, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("access-control-expose-headers", "content-range, preference-applied");
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (chunks.length === 0) return undefined;
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : undefined;
}

function base64Url(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function accessToken(userId: string) {
  return `${base64Url({ alg: "HS256", typ: "JWT" })}.${base64Url({ sub: userId, role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })}.test-signature`;
}

function userFromId(id: string) {
  const account = Object.values(authUsers).find((item) => item.id === id);
  return account
    ? {
        id: account.id,
        aud: "authenticated",
        role: "authenticated",
        email: account.email,
        email_confirmed_at: "2026-07-01T00:00:00.000Z",
        phone: "",
        app_metadata: { provider: "email", providers: ["email"] },
        user_metadata: {},
        identities: [],
        created_at: "2026-07-01T00:00:00.000Z",
        updated_at: "2026-07-01T00:00:00.000Z",
      }
    : null;
}

function userFromRequest(req: IncomingMessage) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token || token === "boundary-interface-test-key") return null;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return userFromId(payload.sub);
  } catch {
    return null;
  }
}

function splitTopLevel(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    if (value[index] === ")") depth -= 1;
    if (value[index] === "," && depth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(value.slice(start));
  return parts.filter(Boolean);
}

function parseScalar(value: string): unknown {
  const decoded = decodeURIComponent(value).replace(/^"|"$/g, "");
  if (decoded === "true") return true;
  if (decoded === "false") return false;
  if (decoded === "null") return null;
  const number = Number(decoded);
  return decoded !== "" && Number.isFinite(number) ? number : decoded;
}

function matchesClause(row: Row, clause: string): boolean {
  if (clause.startsWith("and(") && clause.endsWith(")")) {
    return splitTopLevel(clause.slice(4, -1)).every((part) => matchesClause(row, part));
  }
  if (clause.startsWith("or(") && clause.endsWith(")")) {
    return splitTopLevel(clause.slice(3, -1)).some((part) => matchesClause(row, part));
  }
  const match = clause.match(/^([^.]*)\.(eq|neq|in)\.(.*)$/);
  if (!match) return true;
  const [, column, operator, raw] = match;
  const actual = row[column];
  if (operator === "eq") return actual === parseScalar(raw);
  if (operator === "neq") return actual !== parseScalar(raw);
  const values = raw
    .replace(/^\(|\)$/g, "")
    .split(",")
    .map(parseScalar);
  return values.includes(actual);
}

function filteredRows(table: string, url: URL): Row[] {
  let rows = [...(database[table] ?? [])];
  for (const [key, value] of url.searchParams.entries()) {
    if (["select", "order", "limit", "offset", "columns"].includes(key)) continue;
    if (key === "or") {
      const expression = value.startsWith("(") && value.endsWith(")") ? value.slice(1, -1) : value;
      rows = rows.filter((row) =>
        splitTopLevel(expression).some((part) => matchesClause(row, part)),
      );
      continue;
    }
    rows = rows.filter((row) => matchesClause(row, `${key}.${value}`));
  }

  const order = url.searchParams.get("order");
  if (order) {
    const [column, direction] = order.split(".");
    rows.sort(
      (a, b) =>
        String(a[column] ?? "").localeCompare(String(b[column] ?? "")) *
        (direction === "desc" ? -1 : 1),
    );
  }
  return rows;
}

function singular(req: IncomingMessage) {
  return req.headers.accept?.includes("application/vnd.pgrst.object+json") ?? false;
}

function defaultsFor(table: string, input: Row): Row {
  const createdAt = new Date().toISOString();
  const id = typeof input.id === "string" ? input.id : `${table.slice(0, -1)}-${sequence++}`;
  const defaults: Record<string, Row> = {
    matches: {
      id,
      status: "suggested",
      auto_generated: false,
      approved_by: null,
      approved_at: null,
      created_at: createdAt,
    },
    connections: {
      id,
      participant_a_connected: false,
      participant_b_connected: false,
      connected_at: null,
      status: "pending",
      created_at: createdAt,
    },
    messages: { id, read_at: null, created_at: createdAt },
    meetings: {
      id,
      zoom_meeting_id: null,
      zoom_join_url: null,
      zoom_start_url: null,
      created_at: createdAt,
    },
    notifications: { id, body: null, data: {}, read: false, created_at: createdAt },
    learning_progress: {
      id,
      completed: false,
      completed_at: null,
      time_spent_seconds: 0,
      created_at: createdAt,
    },
  };
  return { ...(defaults[table] ?? { id, created_at: createdAt }), ...input };
}

function maybeFailure(table: string, method: string, res: ServerResponse) {
  const index = failures.findIndex(
    (failure) => failure.table === table && failure.method === method,
  );
  if (index < 0) return false;
  const [failure] = failures.splice(index, 1);
  json(res, 400, {
    code: "MOCK_FAILURE",
    message: failure.message ?? `Mock ${method} failure for ${table}`,
    details: null,
    hint: null,
  });
  return true;
}

async function handleAuth(req: IncomingMessage, res: ServerResponse, url: URL) {
  if (url.pathname === "/auth/v1/token" && req.method === "POST") {
    const body = (await readBody(req)) as {
      email?: string;
      password?: string;
      refresh_token?: string;
    };
    let account = body.email ? authUsers[body.email] : undefined;
    if (url.searchParams.get("grant_type") === "refresh_token" && body.refresh_token) {
      const id = body.refresh_token.replace(/^refresh-/, "");
      account = Object.values(authUsers).find((item) => item.id === id);
    }
    if (!account || (body.password !== undefined && body.password !== account.password)) {
      json(res, 400, {
        code: "invalid_credentials",
        msg: "Invalid login credentials",
        error_description: "Invalid login credentials",
      });
      return;
    }
    const user = userFromId(account.id);
    json(res, 200, {
      access_token: accessToken(account.id),
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: `refresh-${account.id}`,
      user,
    });
    return;
  }
  if (url.pathname === "/auth/v1/user" && req.method === "GET") {
    const user = userFromRequest(req);
    if (!user) json(res, 401, { code: "bad_jwt", msg: "Invalid JWT" });
    else json(res, 200, user);
    return;
  }
  if (url.pathname === "/auth/v1/logout" && req.method === "POST") {
    res.writeHead(204);
    res.end();
    return;
  }
  json(res, 404, { message: `Unhandled auth request: ${req.method} ${url.pathname}` });
}

async function handleRest(req: IncomingMessage, res: ServerResponse, url: URL) {
  const table = url.pathname.split("/").pop() ?? "";
  const method = req.method ?? "GET";
  if (!database[table]) {
    json(res, 404, { code: "PGRST205", message: `Unknown table ${table}` });
    return;
  }
  if (maybeFailure(table, method, res)) return;

  if (method === "GET" || method === "HEAD") {
    const rows = filteredRows(table, url);
    res.setHeader("content-range", rows.length ? `0-${rows.length - 1}/${rows.length}` : "*/0");
    if (method === "HEAD") {
      res.writeHead(200);
      res.end();
      return;
    }
    if (singular(req)) {
      if (rows.length !== 1) {
        json(res, 406, {
          code: "PGRST116",
          message: "JSON object requested, multiple (or no) rows returned",
          details: `The result contains ${rows.length} rows`,
          hint: null,
        });
      } else json(res, 200, rows[0]);
    } else json(res, 200, rows);
    return;
  }

  if (method === "PATCH") {
    const updates = (await readBody(req)) as Row;
    const targets = filteredRows(table, url);
    for (const target of targets) Object.assign(target, updates);
    const returning = req.headers.prefer?.includes("return=representation");
    if (returning) json(res, 200, singular(req) ? targets[0] : targets);
    else {
      res.writeHead(204);
      res.end();
    }
    return;
  }

  if (method === "DELETE") {
    const targets = new Set(filteredRows(table, url));
    database[table] = database[table].filter((row) => !targets.has(row));
    const returning = req.headers.prefer?.includes("return=representation");
    if (returning) json(res, 200, [...targets]);
    else {
      res.writeHead(204);
      res.end();
    }
    return;
  }

  if (method === "POST") {
    const body = await readBody(req);
    const inputs = (Array.isArray(body) ? body : [body]) as Row[];
    const upsert = req.headers.prefer?.includes("resolution=merge-duplicates");
    const rows = inputs.map((input) => {
      const conflictKeys =
        table === "system_settings"
          ? ["key"]
          : table === "learning_progress"
            ? ["user_id", "module_id"]
            : ["id"];
      const existing = upsert
        ? database[table].find((row) =>
            conflictKeys.every((key) => input[key] !== undefined && row[key] === input[key]),
          )
        : undefined;
      if (existing) {
        Object.assign(existing, input);
        return existing;
      }
      const row = defaultsFor(table, input);
      database[table].push(row);
      return row;
    });
    const returning = req.headers.prefer?.includes("return=representation");
    if (returning) json(res, 201, singular(req) ? rows[0] : rows);
    else {
      res.writeHead(201);
      res.end();
    }
    return;
  }

  json(res, 405, { message: `Unhandled REST method ${method}` });
}

const server = createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
  try {
    if (url.pathname === "/__mock/health") {
      json(res, 200, { ok: true });
      return;
    }
    if (url.pathname === "/__mock/reset" && req.method === "POST") {
      database = createDatabase();
      failures = [];
      sequence = 100;
      json(res, 200, { ok: true });
      return;
    }
    if (url.pathname === "/__mock/configure" && req.method === "POST") {
      const body = (await readBody(req)) as { failures?: Failure[]; patch?: MockDatabase };
      failures.push(...(body.failures ?? []));
      for (const [table, rows] of Object.entries(body.patch ?? {})) database[table] = rows;
      json(res, 200, { ok: true });
      return;
    }
    if (url.pathname === "/__mock/state") {
      json(res, 200, database);
      return;
    }
    if (url.pathname.startsWith("/auth/v1/")) {
      await handleAuth(req, res, url);
      return;
    }
    if (url.pathname.startsWith("/rest/v1/")) {
      await handleRest(req, res, url);
      return;
    }
    json(res, 404, { message: `Unhandled request: ${req.method} ${url.pathname}` });
  } catch (error) {
    json(res, 500, { message: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Mock backend listening on http://127.0.0.1:${port}\n`);
});
