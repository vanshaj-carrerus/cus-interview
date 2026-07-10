import dns from "dns";
import { Resolver } from "dns/promises";

const DEFAULT_DNS_SERVERS = [
  "8.8.8.8",
  "8.8.4.4",
  "1.1.1.1",
  "1.0.0.1",
];

let dnsConfigured = false;
const resolvedUriCache = new Map<string, string>();

function configureMongoDns(): void {
  if (dnsConfigured) {
    return;
  }
  dnsConfigured = true;

  const customServers = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (customServers?.length) {
    dns.setServers(customServers);
    return;
  }

  if (process.platform === "win32") {
    dns.setServers(DEFAULT_DNS_SERVERS);
  }
}

function getDnsServers(): string[] {
  const customServers = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  return customServers?.length ? customServers : DEFAULT_DNS_SERVERS;
}

async function resolveSrvRecords(hostname: string) {
  const lookupHost = `_mongodb._tcp.${hostname}`;
  const servers = getDnsServers();
  let lastError: unknown;

  for (const server of servers) {
    try {
      const resolver = new Resolver();
      resolver.setServers([server]);
      return await resolver.resolveSrv(lookupHost);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Could not resolve MongoDB SRV records for ${hostname}.`);
}

async function resolveTxtRecords(hostname: string): Promise<string> {
  const servers = getDnsServers();

  for (const server of servers) {
    try {
      const resolver = new Resolver();
      resolver.setServers([server]);
      const txtRecords = await resolver.resolveTxt(hostname);
      return txtRecords.map((parts) => parts.join("")).join("&");
    } catch {
      // TXT records are optional for Atlas clusters.
    }
  }

  return "";
}

function parseSrvUri(uri: string): {
  credentials: string;
  hostname: string;
  dbName: string;
  extraQuery: string;
} | null {
  if (!uri.startsWith("mongodb+srv://")) {
    return null;
  }

  const withoutScheme = uri.slice("mongodb+srv://".length);
  const atIdx = withoutScheme.lastIndexOf("@");
  const credentials = atIdx >= 0 ? `${withoutScheme.slice(0, atIdx + 1)}` : "";
  const hostAndRest = atIdx >= 0 ? withoutScheme.slice(atIdx + 1) : withoutScheme;
  const slashIdx = hostAndRest.indexOf("/");
  const hostname = slashIdx >= 0 ? hostAndRest.slice(0, slashIdx) : hostAndRest;
  const pathAndQuery = slashIdx >= 0 ? hostAndRest.slice(slashIdx + 1) : "";
  const [dbName = "", extraQuery = ""] = pathAndQuery.split("?", 2);

  return { credentials, hostname, dbName, extraQuery };
}

export async function resolveMongoUri(uri: string): Promise<string> {
  const directUri = process.env.MONGODB_URI_DIRECT?.trim();
  if (directUri) {
    return directUri;
  }

  const trimmed = uri.trim();
  if (!trimmed.startsWith("mongodb+srv://")) {
    return trimmed;
  }

  const cached = resolvedUriCache.get(trimmed);
  if (cached) {
    return cached;
  }

  configureMongoDns();

  const parsed = parseSrvUri(trimmed);
  if (!parsed) {
    return trimmed;
  }

  const srvRecords = await resolveSrvRecords(parsed.hostname);
  const hosts = srvRecords
    .sort((a, b) => a.priority - b.priority || b.weight - a.weight)
    .map((record) => `${record.name.replace(/\.$/, "")}:${record.port}`)
    .join(",");

  const txt = await resolveTxtRecords(parsed.hostname);
  const txtOptions = txt ? `${txt}&ssl=true` : "ssl=true";
  const queryParts = [txtOptions, parsed.extraQuery].filter(Boolean);
  const query = queryParts.join("&");
  const dbPath = parsed.dbName ? `/${parsed.dbName}` : "";
  const resolved = `mongodb://${parsed.credentials}${hosts}${dbPath}?${query}`;

  resolvedUriCache.set(trimmed, resolved);
  return resolved;
}

configureMongoDns();
