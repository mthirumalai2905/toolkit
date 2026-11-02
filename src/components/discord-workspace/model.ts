export type NodeKind = "client" | "service" | "infra" | "data" | "note";

export type ArchNode = {
  id: string;
  name: string;
  kind: NodeKind;
  group: string;
  summary: string;
  description: string;
  technology: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ArchEdge = {
  id: string;
  from: string;
  to: string;
  protocol: string;
  label: string;
};

export type Requirement = {
  id: string;
  bucket: "functional" | "nonfunctional";
  title: string;
  description: string;
  target: string;
};

export type Topic = {
  id: string;
  title: string;
  body: string;
};

export type TableSpec = {
  id: string;
  name: string;
  store: string;
  columns: string;
  notes: string;
};

export type Endpoint = {
  id: string;
  style: "HTTP" | "WebSocket";
  name: string;
  detail: string;
};

export type WorkspaceState = {
  version: 1;
  nodes: ArchNode[];
  edges: ArchEdge[];
  requirements: Requirement[];
  topics: Topic[];
  tables: TableSpec[];
  endpoints: Endpoint[];
};

export const NODE_W = 220;
export const NODE_H = 84;
export const WORLD_W = 1720;
export const WORLD_H = 1120;
export const STORAGE_KEY = "portfolio-discord-hld-v1";

export const GROUPS = [
  { id: "clients", label: "Clients" },
  { id: "edge", label: "Edge" },
  { id: "services", label: "Application services" },
  { id: "realtime", label: "Realtime" },
  { id: "data", label: "Data and infrastructure" },
] as const;

export const KIND_LABEL: Record<NodeKind, string> = {
  client: "Client",
  service: "Service",
  infra: "Infrastructure",
  data: "Data",
  note: "Label",
};

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function node(
  id: string,
  name: string,
  kind: NodeKind,
  group: string,
  x: number,
  y: number,
  summary: string,
  description: string,
  technology = "Proposed, replaceable",
): ArchNode {
  return { id, name, kind, group, summary, description, technology, x, y, w: NODE_W, h: NODE_H };
}

function edge(from: string, to: string, protocol: string, label = ""): ArchEdge {
  return { id: `${from}>${to}`, from, to, protocol, label };
}

const TECH = "Proposed, replaceable";

export function createSeed(): WorkspaceState {
  return {
    version: 1,
    nodes: [
      node(
        "clients",
        "Client Applications",
        "client",
        "clients",
        340,
        48,
        "Web, desktop, and mobile",
        "The product surface. People read, type, join voice, and upload files from here. The three shells share one client model.",
        "Web, desktop, mobile",
      ),
      node(
        "cdn",
        "CDN",
        "infra",
        "edge",
        860,
        48,
        "App shell and public media",
        "Serves the client bundle and cacheable media close to the user. Private attachments still need an authorization check before a download grant.",
      ),
      node(
        "lb",
        "Load Balancer",
        "infra",
        "edge",
        80,
        230,
        "Spreads HTTPS across gateways",
        "Terminates client HTTPS and sends it to healthy API gateway instances. It does not understand guilds or messages.",
      ),
      node(
        "gateway",
        "API Gateway",
        "service",
        "edge",
        340,
        230,
        "Auth and route",
        "Checks the session, then routes the call to the service that owns the action. One front door for the product API.",
      ),
      node(
        "ws",
        "WebSocket Gateway",
        "service",
        "realtime",
        860,
        230,
        "Live connections",
        "Holds the sockets for people who are looking, and pushes events for the channels they are subscribed to.",
      ),
      node(
        "voice",
        "Voice and Video Service",
        "service",
        "realtime",
        1120,
        230,
        "Media sessions",
        "Sets up voice and video apart from the text path. Text being stored must not depend on media being connected.",
        "WebRTC, proposed",
      ),
      node(
        "auth",
        "Authentication Service",
        "service",
        "services",
        80,
        450,
        "Sessions and tokens",
        "Issues and checks credentials. It does not own profiles, friends, or servers.",
      ),
      node(
        "users",
        "User Service",
        "service",
        "services",
        340,
        450,
        "Profiles, friends, blocks",
        "The person, who they can see, and who they have blocked. Friend state is not a channel.",
      ),
      node(
        "guilds",
        "Server and Channel Service",
        "service",
        "services",
        600,
        450,
        "Places, rooms, permissions",
        "A server is a place. A channel is a room. Membership and roles decide who may see it and who may speak.",
      ),
      node(
        "presence",
        "Presence Service",
        "service",
        "realtime",
        860,
        450,
        "Online, idle, in voice",
        "Heartbeats and voice state. Presence is a live fact, not something you reconstruct by scanning messages.",
      ),
      node(
        "messaging",
        "Messaging Service",
        "service",
        "services",
        80,
        570,
        "Accept, order, store",
        "Takes a send, checks the room, writes the message in channel order, then hands delivery to the queue.",
      ),
      node(
        "notify",
        "Notification Service",
        "service",
        "services",
        340,
        570,
        "Push for people away",
        "Mentions, DMs, and other alerts for members who are not watching the channel right now.",
      ),
      node(
        "moderation",
        "Moderation Service",
        "service",
        "services",
        600,
        570,
        "Reports and removals",
        "Reports, message deletes, and an audit of moderator actions. Removal is its own action, not a silent edit.",
      ),
      node(
        "bots",
        "Bot and Integration Service",
        "service",
        "services",
        860,
        570,
        "Tokens and webhooks",
        "Bot credentials, slash commands, and outbound hooks. A bot is a member with a different door, not a second product.",
      ),
      node(
        "search",
        "Search Service",
        "service",
        "services",
        80,
        690,
        "Find what you may see",
        "Search only returns messages and members the caller is allowed to open. The index is not a way around permissions.",
      ),
      node(
        "files",
        "File Storage Service",
        "service",
        "services",
        340,
        690,
        "Upload grants",
        "Authorizes an upload or download. The bytes themselves live in object storage.",
      ),
      node(
        "queue",
        "Message Queue",
        "infra",
        "data",
        80,
        880,
        "Stored is not delivered",
        "Lets the write finish before fan-out, notifications, and indexing. Those consumers can fail without losing the message.",
        "Queue, proposed",
      ),
      node(
        "redis",
        "Redis / Caching Layer",
        "data",
        "data",
        340,
        880,
        "Hot state",
        "Presence, session lookups, and rate limits. If this is cold, the product degrades. It is not the message log.",
        "Cache, proposed",
      ),
      node(
        "sql",
        "Relational Database",
        "data",
        "data",
        600,
        880,
        "People, places, roles",
        "Users, friends, servers, channels, membership, and roles. These are relationships you query together.",
        "Relational, proposed",
      ),
      node(
        "nosql",
        "NoSQL Database",
        "data",
        "data",
        860,
        880,
        "Message log",
        "Append-only messages partitioned by channel, so a room's history is one ordered slice and not a scan of the world.",
        "Wide-column or document, proposed",
      ),
      node(
        "object",
        "Object Storage",
        "data",
        "data",
        1120,
        880,
        "Attachments",
        "File bytes and media. The file service stores the grant and the pointer, not the blob.",
        "Object store, proposed",
      ),
      node(
        "index",
        "Search Index",
        "data",
        "data",
        1380,
        880,
        "Queryable text",
        "Text the search service is allowed to ask about. Rebuilt from the log. Not a second source of truth for permissions.",
        "Search index, proposed",
      ),
    ],
    edges: [
      edge("clients", "cdn", "HTTPS", "static assets"),
      edge("clients", "lb", "HTTPS", "API"),
      edge("clients", "ws", "WSS", "subscribe"),
      edge("clients", "voice", "WebRTC", "media"),
      edge("lb", "gateway", "HTTP", "route"),
      edge("gateway", "auth", "internal", "check session"),
      edge("gateway", "users", "internal"),
      edge("gateway", "guilds", "internal"),
      edge("gateway", "messaging", "internal", "send"),
      edge("gateway", "notify", "internal"),
      edge("gateway", "moderation", "internal"),
      edge("gateway", "bots", "internal"),
      edge("gateway", "search", "internal"),
      edge("gateway", "files", "internal"),
      edge("bots", "gateway", "HTTPS", "inbound"),
      edge("messaging", "queue", "queue", "after persist"),
      edge("messaging", "nosql", "write", "channel log"),
      edge("queue", "ws", "queue", "fan-out"),
      edge("queue", "notify", "queue", "mentions"),
      edge("queue", "search", "queue", "index"),
      edge("ws", "presence", "internal", "watching"),
      edge("presence", "redis", "cache", "heartbeats"),
      edge("voice", "redis", "cache", "sessions"),
      edge("auth", "sql", "SQL"),
      edge("users", "sql", "SQL"),
      edge("guilds", "sql", "SQL"),
      edge("files", "object", "storage"),
      edge("cdn", "object", "storage", "origin"),
      edge("search", "index", "query"),
    ],
    requirements: [
      req("functional", "User Management", "Accounts, profiles, and settings.", "Create and update a profile in one request."),
      req("functional", "Friend Management", "Requests, accepts, blocks.", "A block hides later messages both ways."),
      req("functional", "Server Management", "Create a place, invite, leave.", "A new server has an owner and a default room."),
      req("functional", "Channel Management", "Text and voice rooms inside a server.", "A hidden channel is a permission, not a missing row."),
      req("functional", "Roles and Permissions", "Who may see, send, and moderate.", "A send is rejected if the member cannot see the room."),
      req("functional", "Messaging", "Ordered text in a channel.", "A refresh shows the same order the room already had."),
      req("functional", "Direct Messaging", "A small room with a fixed set of people.", "DMs use the channel shape, not a second product."),
      req("functional", "Voice and Video Calls", "Talk and video without blocking text.", "Media can fail while text send still succeeds."),
      req("functional", "Notifications", "Alerts when you are not looking.", "A mention reaches a member who is offline."),
      req("functional", "Search", "Find messages you are allowed to open.", "A result never includes a channel you cannot see."),
      req("functional", "File Sharing", "Attachments on a message.", "The upload finishes before the message is visible."),
      req("functional", "Moderation", "Report, delete, and audit.", "A delete leaves an audit row."),
      req("functional", "Bots and Integrations", "Tokens, commands, and webhooks.", "A bot action is checked like a member action."),
      req("nonfunctional", "Scalability", "More people and more servers without a rewrite.", "Write and fan-out grow by adding instances, not by a bigger single box."),
      req("nonfunctional", "Availability", "The place stays open when a part is down.", "Proposed target: 99.9% for sending a message."),
      req("nonfunctional", "Reliability", "An accepted message is not lost.", "A stored message survives a gateway restart."),
      req("nonfunctional", "Low Latency", "Live rooms feel live.", "Proposed target: p99 under 250ms to members already watching the channel."),
      req("nonfunctional", "Consistency", "A room has one order.", "Two clients asking for the same cursor see the same sequence."),
      req("nonfunctional", "Fault Tolerance", "One dead instance is not an outage.", "Losing one gateway drops sockets, not the log."),
      req("nonfunctional", "Security", "Every action is checked.", "No service trusts a client-supplied permission bit."),
      req("nonfunctional", "Privacy", "You cannot read a room you are not in.", "Search, CDN, and logs follow the same rule."),
      req("nonfunctional", "Durability", "History outlives the live connection.", "The log is the record. The socket is a view."),
      req("nonfunctional", "Maintainability", "A service can be replaced.", "Each box names a proposed technology, not a permanent one."),
      req("nonfunctional", "Observability", "You can see a send fail.", "Send, fan-out, and push each emit a trace."),
      req("nonfunctional", "Data Retention", "History has a policy.", "A channel states how long messages are kept."),
    ],
    topics: [
      topic(
        "architecture",
        "System Architecture",
        "Clients reach an edge: CDN for the shell, a load balancer for the API, a websocket gateway for live events, and a media service for voice. The API gateway checks the session and calls the service that owns the action. Messaging stores first, then a queue fans the event out. This is a proposed split, not a map of anyone's production cluster.",
      ),
      topic(
        "schema",
        "Database Schema and Relationships",
        "People, friends, servers, channels, membership, and roles live in a relational store because those links are queried together. Messages are an append-only log partitioned by channel. Read state is a cursor per member per channel, not a recount of the log.",
      ),
      topic(
        "api",
        "API Design",
        "Product actions are HTTP through the gateway. Live updates are websocket events after the write has succeeded. A client never learns that a message exists from the socket if the log does not have it.",
      ),
      topic(
        "websocket",
        "WebSocket Communication",
        "The client identifies, then subscribes to the channels on screen. The gateway pushes events for those subscriptions. A dropped socket is resumed from the last event cursor, or from the log if the cursor is gone.",
      ),
      topic(
        "delivery",
        "Message Delivery Lifecycle",
        "Check the room, write the message in order, acknowledge the sender, then publish. The queue feeds sockets, notifications, and search. Delivery to someone who is offline is a notification, not a held socket.",
      ),
      topic(
        "presence",
        "Real-time Presence",
        "Heartbeats update a short-lived presence record. Online, idle, and in-voice are derived from that record. Presence is allowed to be briefly wrong. The message log is not.",
      ),
      topic(
        "voice",
        "Voice and Video Architecture",
        "Media is negotiated directly with a voice edge and does not pass through the text log. The voice service records who is in the room. Text send keeps working if media does not.",
      ),
      topic(
        "cache",
        "Caching Strategy",
        "Cache sessions, permission lookups, and presence. Do not cache a permission forever. Do not treat the cache as the history of a channel.",
      ),
      topic(
        "sharding",
        "Database Partitioning and Sharding",
        "The message log is partitioned by channel so a room's page is one slice. Guild metadata stays in the relational store. A hot channel is a hot partition you isolate, not a reason to scan every message.",
      ),
      topic(
        "balancing",
        "Load Balancing",
        "HTTPS is spread across stateless gateway instances. Websocket gateways are sticky for the life of a connection. Voice edges are chosen by region, not by the API load balancer.",
      ),
      topic(
        "failure",
        "Failure Handling",
        "If the queue is slow, the send is already stored and the client can refresh. If a socket gateway dies, clients reconnect and catch up. If presence cache is empty, show unknown rather than dropping messages.",
      ),
      topic(
        "security",
        "Security Architecture",
        "The gateway authenticates. The owning service authorizes against membership and roles. Object storage and search receive the decision. They do not invent their own.",
      ),
    ],
    tables: [
      table("users", "Relational", "id, username, display_name, created_at", "The person. Not their servers."),
      table("friendships", "Relational", "user_id, friend_id, status, created_at", "Request, accepted, or blocked."),
      table("guilds", "Relational", "id, name, owner_id, created_at", "A server. The place."),
      table("channels", "Relational", "id, guild_id, kind, name, position", "guild_id is empty for a DM."),
      table("members", "Relational", "guild_id, user_id, joined_at", "Who is in the place."),
      table("roles", "Relational", "id, guild_id, name, permissions", "The rule for a room, stored on the role."),
      table("messages", "NoSQL", "channel_id, id, author_id, body, created_at", "Ordered by id inside a channel."),
      table("read_states", "NoSQL", "user_id, channel_id, last_read_id", "Unread is a cursor, not a count."),
    ],
    endpoints: [
      endpoint("HTTP", "POST /sessions", "Start a session. Authentication service."),
      endpoint("HTTP", "GET /users/@me", "The caller. User service."),
      endpoint("HTTP", "POST /guilds", "Create a server and a default channel."),
      endpoint("HTTP", "GET /channels/:id/messages", "A bounded page of history, newest first."),
      endpoint("HTTP", "POST /channels/:id/messages", "Check the room, store, then queue."),
      endpoint("HTTP", "POST /channels/:id/attachments", "A grant for object storage."),
      endpoint("HTTP", "GET /search", "Query the index, then drop anything the caller cannot see."),
      endpoint("WebSocket", "IDENTIFY", "Attach the socket to a session."),
      endpoint("WebSocket", "MESSAGE_CREATE", "A stored message, pushed to subscribers."),
      endpoint("WebSocket", "PRESENCE_UPDATE", "Online, idle, or in voice."),
      endpoint("WebSocket", "TYPING_START", "Ephemeral. Not written to the log."),
    ],
  };
}

function req(
  bucket: Requirement["bucket"],
  title: string,
  description: string,
  target: string,
): Requirement {
  return { id: title.toLowerCase().replace(/[^a-z]+/g, "-"), bucket, title, description, target };
}

function topic(id: string, title: string, body: string): Topic {
  return { id, title, body };
}

function table(name: string, store: string, columns: string, notes: string): TableSpec {
  return { id: name, name, store, columns, notes };
}

function endpoint(style: Endpoint["style"], name: string, detail: string): Endpoint {
  return { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), style, name, detail };
}

export const PALETTE: { kind: NodeKind; name: string; group: string; summary: string }[] = [
  { kind: "service", name: "New service", group: "services", summary: "One responsibility" },
  { kind: "infra", name: "New infrastructure", group: "edge", summary: "A supporting piece" },
  { kind: "data", name: "New data store", group: "data", summary: "A store with one job" },
  { kind: "client", name: "New client", group: "clients", summary: "Another surface" },
  { kind: "note", name: "Label", group: "", summary: "A note on the canvas" },
];

export function createNode(kind: NodeKind, name: string, group: string, summary: string, x: number, y: number): ArchNode {
  const note = kind === "note";
  return {
    id: uid(kind),
    name,
    kind,
    group,
    summary,
    description: "",
    technology: TECH,
    x: Math.max(0, x),
    y: Math.max(0, y),
    w: note ? 180 : NODE_W,
    h: note ? 64 : NODE_H,
  };
}
