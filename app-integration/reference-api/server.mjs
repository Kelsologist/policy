import { createServer } from 'node:http';
import { readFileSync, existsSync, appendFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const manifestPath = join(repoRoot, 'app-integration', 'policy-manifest.json');
const policyIndexPath = join(repoRoot, 'POLICY_INDEX.md');
const acceptanceStorePath = join(__dirname, 'data', 'policy_acceptance_events.jsonl');
const rightsStorePath = join(__dirname, 'data', 'data_rights_requests.jsonl');

const LEGACY_ROUTE_REDIRECTS = {
  '/privacy-policy': '/privacy',
  '/terms-of-service': '/terms',
  '/delete-data': '/data-deletion'
};

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const policyByRoute = new Map(manifest.public_policies.map((entry) => [entry.route, entry]));
const policyByKey = new Map(manifest.public_policies.map((entry) => [entry.policy_key, entry]));
const mutableStatuses = new Set(['open', 'in_progress', 'completed', 'rejected']);

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

function parsePolicyMetadata(markdown) {
  const lastUpdatedMatch = markdown.match(/^\*\*Last updated:\*\*\s*(.+)$/m);
  const effectiveDateMatch = markdown.match(/^\*\*Effective date:\*\*\s*(.+)$/m);
  const versionMatch = markdown.match(/^\*\*Version:\*\*\s*(.+)$/m);
  return {
    last_updated: lastUpdatedMatch?.[1]?.trim() || null,
    effective_date: effectiveDateMatch?.[1]?.trim() || null,
    version: versionMatch?.[1]?.trim() || null
  };
}

function parseJsonl(path) {
  if (!existsSync(path)) {
    return [];
  }
  const content = readFileSync(path, 'utf8').trim();
  if (!content) {
    return [];
  }
  return content
    .split('\n')
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function appendJsonl(path, row) {
  appendFileSync(path, `${JSON.stringify(row)}\n`, 'utf8');
}

function validateManifestAgainstPolicyIndex() {
  const policyIndex = readFileSync(policyIndexPath, 'utf8');
  const indexMappings = [...policyIndex.matchAll(/- `([^`]+)` -> `([^`]+)`/g)].map((m) => ({
    route: m[1],
    file: m[2]
  }));

  for (const policy of manifest.public_policies) {
    const mapped = indexMappings.find((entry) => entry.route === policy.route);
    if (!mapped) {
      throw new Error(`Missing route '${policy.route}' in POLICY_INDEX.md`);
    }
    if (!policy.source_file.endsWith(mapped.file)) {
      throw new Error(`Route '${policy.route}' source mismatch between manifest and POLICY_INDEX.md`);
    }
  }

  for (const route of manifest.stable_routes || []) {
    if (!policyByRoute.has(route)) {
      throw new Error(`Stable route '${route}' is not present in public_policies`);
    }
  }
}

function latestAcceptanceByPolicy(userId) {
  const events = parseJsonl(acceptanceStorePath).filter((event) => event.user_id === userId);
  const latest = new Map();
  for (const event of events) {
    const current = latest.get(event.policy_key);
    if (!current || event.accepted_at_utc > current.accepted_at_utc) {
      latest.set(event.policy_key, event);
    }
  }
  return latest;
}

function getConsentStatus(userId) {
  const latest = latestAcceptanceByPolicy(userId);
  const tracked = ['privacy', 'terms'];
  const checks = tracked.map((policyKey) => {
    const current = policyByKey.get(policyKey);
    const accepted = latest.get(policyKey) || null;
    const isCurrent = Boolean(
      current &&
        accepted &&
        accepted.accepted_version === current.policy_version
    );

    return {
      policy_key: policyKey,
      current_version: current?.policy_version || null,
      accepted_version: accepted?.accepted_version || null,
      accepted_at_utc: accepted?.accepted_at_utc || null,
      requires_reacceptance: !isCurrent
    };
  });

  return {
    user_id: userId,
    requires_reacceptance: checks.some((check) => check.requires_reacceptance),
    checks
  };
}

function ensureStores() {
  if (!existsSync(acceptanceStorePath)) {
    writeFileSync(acceptanceStorePath, '', 'utf8');
  }
  if (!existsSync(rightsStorePath)) {
    writeFileSync(rightsStorePath, '', 'utf8');
  }
}

validateManifestAgainstPolicyIndex();
ensureStores();

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');
  const { pathname } = requestUrl;

  if (LEGACY_ROUTE_REDIRECTS[pathname]) {
    res.writeHead(308, { Location: LEGACY_ROUTE_REDIRECTS[pathname] });
    res.end();
    return;
  }

  if (req.method === 'GET' && pathname === '/health') {
    sendJson(res, 200, { ok: true, manifest_version: manifest.version });
    return;
  }

  const policy = policyByRoute.get(pathname);
  if (req.method === 'GET' && policy) {
    const markdown = readFileSync(policy.source_file, 'utf8');
    sendText(res, 200, markdown, 'text/markdown; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && pathname === '/api/policies/metadata') {
    const data = manifest.public_policies.map((entry) => {
      const markdown = readFileSync(entry.source_file, 'utf8');
      const parsed = parsePolicyMetadata(markdown);
      return {
        policy_key: entry.policy_key,
        route: entry.route,
        policy_version: entry.policy_version,
        last_updated: parsed.last_updated
      };
    });

    sendJson(res, 200, { policies: data });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/policies/acceptance') {
    try {
      const body = await readJsonBody(req);
      const { user_id, policy_key, accepted_version, accepted_at_utc, acceptance_source } = body;

      if (!user_id || !policy_key || !accepted_version || !accepted_at_utc || !acceptance_source) {
        sendJson(res, 400, { error: 'Missing required fields' });
        return;
      }

      const knownPolicy = policyByKey.get(policy_key);
      if (!knownPolicy) {
        sendJson(res, 400, { error: 'Unknown policy_key' });
        return;
      }

      const record = {
        id: randomUUID(),
        user_id,
        policy_key,
        accepted_version,
        accepted_at_utc,
        acceptance_source,
        created_at_utc: new Date().toISOString()
      };
      appendJsonl(acceptanceStorePath, record);
      sendJson(res, 201, { acceptance: record });
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }

  if (req.method === 'GET' && pathname === '/api/policies/consent-status') {
    const userId = requestUrl.searchParams.get('user_id');
    if (!userId) {
      sendJson(res, 400, { error: 'Missing user_id query parameter' });
      return;
    }
    sendJson(res, 200, getConsentStatus(userId));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/data-rights-requests') {
    try {
      const body = await readJsonBody(req);
      const {
        user_id = null,
        email,
        request_type,
        intake_channel,
        requested_at_utc,
        status = 'open',
        due_at_utc = null,
        completed_at_utc = null,
        notes = null
      } = body;

      if (!email || !request_type || !intake_channel || !requested_at_utc) {
        sendJson(res, 400, { error: 'Missing required fields' });
        return;
      }

      if (!mutableStatuses.has(status)) {
        sendJson(res, 400, { error: 'Invalid status value' });
        return;
      }

      const record = {
        id: randomUUID(),
        user_id,
        email,
        request_type,
        status,
        intake_channel,
        requested_at_utc,
        due_at_utc,
        completed_at_utc,
        notes
      };
      appendJsonl(rightsStorePath, record);
      sendJson(res, 201, { request: record });
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }

  if (req.method === 'GET' && pathname === '/api/admin/data-rights-requests') {
    const status = requestUrl.searchParams.get('status');
    const all = parseJsonl(rightsStorePath);
    const filtered = status ? all.filter((entry) => entry.status === status) : all;
    sendJson(res, 200, { requests: filtered });
    return;
  }

  if (req.method === 'PATCH' && pathname.startsWith('/api/admin/data-rights-requests/')) {
    try {
      const id = pathname.split('/').pop();
      const body = await readJsonBody(req);
      const rows = parseJsonl(rightsStorePath);
      const index = rows.findIndex((row) => row.id === id);

      if (index < 0) {
        sendJson(res, 404, { error: 'Request not found' });
        return;
      }

      const next = { ...rows[index] };
      if (body.status !== undefined) {
        if (!mutableStatuses.has(body.status)) {
          sendJson(res, 400, { error: 'Invalid status value' });
          return;
        }
        next.status = body.status;
      }
      if (body.due_at_utc !== undefined) next.due_at_utc = body.due_at_utc;
      if (body.completed_at_utc !== undefined) next.completed_at_utc = body.completed_at_utc;
      if (body.notes !== undefined) next.notes = body.notes;

      rows[index] = next;
      writeFileSync(rightsStorePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
      sendJson(res, 200, { request: next });
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }

  sendJson(res, 404, { error: 'Not found' });
});

const port = Number(process.env.PORT || 8787);
server.listen(port, () => {
  console.log(`Policy reference API listening on http://localhost:${port}`);
});
