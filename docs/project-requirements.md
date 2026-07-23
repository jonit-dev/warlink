# Product Requirements Document: WarLink

**Status:** Draft
**Target release:** MVP
**Product type:** Private desktop application
**Platforms:** Windows 10/11 x64; Ubuntu/Pop!\_OS x64
**Desktop stack:** Go + Wails + TypeScript
**Control plane:** Cloudflare Workers + Durable Objects
**Network transport:** ZeroTier One
**Supported game build:** Warcraft III: Reforged `1.32.10.18820`

---

## 1. Executive Summary

WarLink is a cross-platform desktop launcher that lets nontechnical users play Warcraft III LAN multiplayer over the internet.

Players are located on different physical networks and may use different operating systems. WarLink hides ZeroTier installation, network joining, device authorization, firewall configuration, connectivity checks, and Warcraft launching behind two primary actions:

- **Host Game**
- **Join Game**

A host creates a temporary room and receives an eight-character code. Other players enter that code, and WarLink automatically connects their computers to a private ZeroTier network, authorizes their devices, verifies connectivity, and launches Warcraft.

Friends do not need:

- A ZeroTier account.
- A Cloudflare account.
- Router configuration.
- Port forwarding knowledge.
- Command-line knowledge.
- Access to the host’s ZeroTier API token.

WarLink does not distribute, patch, crack, or modify Warcraft. It operates only as a network and launch-management utility for an existing installation.

---

## 2. Why Cloudflare Is Included

Cloudflare will provide the product’s control plane:

- Temporary room-code creation.
- Room membership and presence.
- Secure storage of the ZeroTier Central API token.
- Automatic ZeroTier member authorization.
- Host and player WebSocket events.
- Rate limiting against room-code guessing.
- Automatic room expiration and membership cleanup.
- Optional release-manifest and update hosting.

Cloudflare Durable Objects are appropriate because each room needs a single, strongly consistent state holder with real-time WebSocket coordination. Cloudflare describes Durable Objects as stateful compute with private, transactional storage, and recommends Workers as the stateless entry point for authentication and validation.

The ZeroTier Central API token will be stored as a Cloudflare Worker secret. It must never be embedded in the desktop application or committed to the source repository. Cloudflare explicitly recommends secrets rather than ordinary configuration variables for sensitive values.

### What Cloudflare will not do

Cloudflare will not carry ordinary Warcraft game traffic.

Cloudflare Tunnel can publish TCP services, but public TCP applications use TCP over WebSockets and require client-side `cloudflared`; this is not equivalent to the virtual Ethernet interface Warcraft LAN discovery expects.

Cloudflare Spectrum can proxy TCP and UDP applications, including games, but it is an origin-proxy product rather than a peer-to-peer virtual LAN. It is unnecessary for the MVP.

---

## 3. Problem Statement

Playing Warcraft III LAN multiplayer over the internet currently requires users to:

1. Install ZeroTier.
2. Join the correct network.
3. Send their ZeroTier node ID to the administrator.
4. Wait for authorization.
5. Verify that ZeroTier assigned an address.
6. Configure local firewall rules.
7. Find the correct Warcraft executable.
8. Confirm that everyone has the same game build and map.
9. Troubleshoot connectivity manually.
10. Open Warcraft and navigate to the LAN lobby.

This workflow is unsuitable for friends or family members who are not technical.

The desired workflow is:

```text
Install WarLink
→ Enter room code
→ Click Join
→ Warcraft opens
```

---

## 4. Product Goals

### Primary goals

1. Let a new player join an online Warcraft LAN session without understanding ZeroTier.
2. Require no ZeroTier account for participating players.
3. Require no router configuration or manual port forwarding.
4. Support mixed Windows and Linux sessions.
5. Keep the ZeroTier administrative token off all client computers.
6. Automatically remove temporary ZeroTier access after a session.
7. Detect common problems and explain them in plain language.
8. Avoid operating a VPS or permanent game relay.
9. Keep incremental infrastructure cost negligible for a small private group.
10. Make the normal recurring experience no more complicated than entering a room code.

### Secondary goals

- Show player readiness in real time.
- Launch Warcraft on all participating computers.
- Detect build mismatches.
- Detect custom-map mismatches.
- Report whether a ZeroTier connection is direct or relayed.
- Collect a privacy-safe diagnostic bundle when joining fails.

---

## 5. Non-Goals

The MVP will not:

- Download or distribute Warcraft.
- Circumvent Battle.net authentication or game DRM.
- Patch Warcraft executables.
- Host Warcraft game servers.
- Route general internet traffic through another player.
- Replace the ZeroTier protocol.
- Support public matchmaking.
- Support anonymous public rooms.
- Transfer arbitrary game files.
- Support macOS.
- Support every Linux distribution.
- Guarantee compatibility with Warcraft builds other than `1.32.10.18820`.
- Implement voice chat.
- Operate multiple simultaneous rooms on the same ZeroTier network.
- Route game traffic through Cloudflare.
- Self-host the ZeroTier controller.

---

## 6. Target Users

### Host

The host is the person organizing the session.

The host should be able to:

- Create a room.
- Copy or share the room code.
- See connected players.
- See readiness and diagnostic status.
- remove an unexpected participant.
- Launch Warcraft for everyone.
- Close the room.

The initial MVP may restrict room creation to João’s enrolled host device.

### Player

A player is a nontechnical friend or family member.

The player should only need to:

1. Install WarLink.
2. Enter a display name.
3. Enter the room code.
4. Click **Join Game**.
5. Accept one operating-system administrator prompt during initial installation.

Players must not create accounts.

---

## 7. Technical Foundation

ZeroTier One runs as a system service and creates a virtual TAP network port that behaves like an ordinary Ethernet interface. The service runs with administrative privileges while an ordinary user-facing application communicates with it locally.

ZeroTier supports Windows and Linux across x86 and ARM architectures. The MVP will intentionally support a smaller tested matrix.

ZeroTier Central exposes APIs for programmatically managing networks and members. Members must be authorized before communicating, and the API can be used to authorize or deauthorize devices.

### Supported MVP matrix

| Component          | Supported                                                   |
| ------------------ | ----------------------------------------------------------- |
| Windows            | Windows 10 and 11, x64                                      |
| Linux              | Ubuntu 22.04+, Ubuntu 24.04+, Pop!\_OS equivalents          |
| Linux game runtime | Wine, Lutris or Bottles through configurable launch command |
| Warcraft           | `1.32.10.18820` only                                        |
| Players            | Target 2–8                                                  |
| Architecture       | x86-64                                                      |
| Network            | Separate home networks over the public internet             |

Fedora, Arch Linux, ARM, macOS and Steam Deck support are deferred.

---

## 8. User Experience

## 8.1 First Launch

WarLink displays:

```text
Welcome to WarLink

We will check:
✓ Warcraft installation
✓ Network component
✓ Firewall access

[ Get Started ]
```

WarLink then:

1. Requests a display name.
2. Detects the operating system.
3. Detects whether ZeroTier is installed.
4. Installs or repairs the ZeroTier service when necessary.
5. Detects the Warcraft installation.
6. Lets the user browse for the executable or configure a Linux launch command when automatic detection fails.
7. Verifies the Warcraft build.
8. Runs a local firewall and service diagnostic.
9. Saves the completed configuration.

The user should encounter no more than one UAC or `sudo` authorization during normal initial setup.

---

## 8.2 Home Screen

```text
WarLink

[ Host Game ]

Room code
[ _ _ _ _  _ _ _ _ ]

[ Join Game ]

Warcraft III: Ready
Network: Ready
```

Advanced settings and diagnostics are placed behind a small settings button and are not shown during the normal workflow.

---

## 8.3 Host Flow

1. User clicks **Host Game**.
2. Desktop client signs a create-room request using the host device key.
3. Cloudflare creates a room Durable Object.
4. The control plane pre-authorizes the host’s ZeroTier node.
5. The local agent joins the configured ZeroTier network.
6. WarLink verifies that the host has received a managed IP address.
7. WarLink creates temporary firewall permissions for the ZeroTier interface.
8. The room code is displayed.

Example:

```text
Your room is ready

Room code:
WOLF-7K2M

Players
✓ João       Ready
○ Waiting for players...

[ Copy Code ]       [ Launch Warcraft ]
```

The room expires automatically after four hours unless closed earlier.

---

## 8.4 Join Flow

1. Player enters an eight-character room code.
2. WarLink reads the local ZeroTier node ID.
3. WarLink submits the room code, node ID, display name, platform and game build to the Cloudflare Worker.
4. The Worker validates the room and rate limit.
5. The Worker uses the ZeroTier Central API to authorize that node.
6. The Worker returns the ZeroTier network ID and a short-lived room session token.
7. The local privileged agent joins the network.
8. WarLink waits for a managed ZeroTier IP.
9. WarLink applies a temporary firewall rule limited to the ZeroTier interface.
10. WarLink tests reachability to the host.
11. WarLink checks the Warcraft build.
12. The player appears as **Ready**.

Example:

```text
Joining WOLF-7K2M

✓ Room found
✓ Network connected
✓ João reachable
✓ Warcraft version matches

You are ready.

[ Open Warcraft ]
```

---

## 8.5 Launch Flow

The host clicks **Launch Warcraft**.

The room Durable Object broadcasts a signed launch event to every connected client.

Each client:

1. Confirms that the command refers only to its configured Warcraft installation.
2. Launches Warcraft.
3. Displays brief instructions:

```text
In Warcraft:

1. Open Local Area Network
2. Wait for João's game
3. Join the lobby
```

The application must never accept an arbitrary executable path or shell command from the host or control plane.

---

## 8.6 Leave and Cleanup Flow

When a player clicks **Leave**, closes WarLink, or stops sending heartbeats:

1. The local agent leaves the ZeroTier network.
2. Temporary firewall rules are removed.
3. The Worker marks the player disconnected.
4. When the room closes, all temporary room members are deauthorized or deleted from the ZeroTier network.
5. Room state expires from Durable Object storage.
6. Diagnostic logs are retained locally unless the user explicitly exports them.

Cleanup must be idempotent. Repeating it must not produce errors or leave the client in a broken state.

---

## 9. System Architecture

```text
┌──────────────────────────────────────────────────────┐
│                Cloudflare Control Plane              │
│                                                      │
│  Worker API                                          │
│    ├── Request validation                            │
│    ├── Rate limiting                                 │
│    ├── Host authentication                           │
│    └── ZeroTier Central API adapter                  │
│                                                      │
│  Durable Object per room                             │
│    ├── Room state                                    │
│    ├── Player presence                               │
│    ├── WebSocket connections                         │
│    ├── Launch events                                 │
│    └── Expiration and cleanup                        │
│                                                      │
│  Worker secrets                                      │
│    ├── ZEROTIER_API_TOKEN                            │
│    ├── ZEROTIER_NETWORK_ID                           │
│    └── CONTROL_PLANE_SIGNING_KEY                     │
└──────────────────────────┬───────────────────────────┘
                           │ HTTPS / WebSocket
             Control only; no Warcraft traffic
                           │
          ┌────────────────┴────────────────┐
          │                                 │
┌─────────▼──────────┐            ┌─────────▼──────────┐
│ Windows computer  │            │ Linux computer    │
│                   │            │                   │
│ WarLink UI        │            │ WarLink UI        │
│ WarLink Agent     │            │ WarLink Agent     │
│ ZeroTier Service  │◄══════════►│ ZeroTier Service  │
│ Warcraft III      │ Game data  │ Wine + Warcraft   │
└───────────────────┘  over ZT   └───────────────────┘
```

---

## 10. Desktop Components

### 10.1 WarLink UI

**Technology:** Wails with Go backend and TypeScript frontend.

Responsibilities:

- Render Host and Join screens.
- Show room and player status.
- Handle first-run setup.
- Locate Warcraft.
- Display plain-language diagnostics.
- Communicate with the local privileged agent.
- Maintain the WebSocket connection to the room.
- Initiate game launch through the local agent.

The UI runs without administrative privileges.

### 10.2 WarLink Agent

**Technology:** Go.

The agent is installed as:

- A Windows Service on Windows.
- A `systemd` service on Linux.

Responsibilities:

- Install, update or verify ZeroTier.
- Communicate with the local ZeroTier service API.
- Read the local ZeroTier node ID.
- Join and leave the configured network.
- Read assigned managed IP addresses.
- Inspect peer connectivity.
- Add and remove temporary firewall rules.
- Launch only the configured Warcraft executable.
- Collect local diagnostics.
- Report health to the UI.

Local communication will use:

- A Windows named pipe with restrictive ACLs.
- A Unix domain socket owned by the WarLink user group.

The agent must reject requests from unauthorized local users.

### 10.3 ZeroTier Service

The official ZeroTier One service will provide the virtual network interface and game transport.

MVP installation strategy:

1. Download a pinned, tested official ZeroTier package from an official source.
2. Verify its expected SHA-256 hash.
3. On Windows, also verify the installer’s digital publisher signature.
4. Install using a single elevated prompt.
5. Keep the ZeroTier version pinned until a newer version passes compatibility testing.

WarLink will not silently upgrade ZeroTier immediately when a new upstream release appears.

Redistributing a ZeroTier binary inside the WarLink installer is deferred pending a license and release-process review. The core and service portions of current ZeroTier One are under MPL 2.0, while controller components have separate licensing; current default binary builds no longer include the controller.

---

## 11. Cloudflare Components

### 11.1 Worker API

Recommended implementation:

- TypeScript.
- Hono or a minimal router.
- JSON API.
- Cloudflare Rate Limiting binding.
- Durable Object binding.
- Secrets for ZeroTier credentials.

Cloudflare’s Workers Rate Limiting API can enforce route- and resource-specific limits from within Worker code.

### 11.2 Room Durable Object

One Durable Object represents one room.

Responsibilities:

- Maintain authoritative room state.
- Maintain WebSocket connections.
- Track heartbeats.
- Track readiness.
- Broadcast player changes.
- Broadcast launch events.
- Enforce room capacity.
- Enforce room expiration.
- Trigger ZeroTier cleanup.

### 11.3 Persistent Database

D1 is not required for the MVP.

Durable Object storage is sufficient for ephemeral room state. A small D1 database may be introduced later for:

- Host-device enrollment.
- Audit history.
- Release channels.
- Revoked host keys.
- Aggregate reliability metrics.

### 11.4 Custom Domain

Recommended endpoint:

```text
api.warlink.example.com
```

The API endpoint will be compiled into release builds and overrideable through a signed enterprise/developer configuration file.

---

## 12. API Specification

### Create room

```http
POST /v1/rooms
```

Request:

```json
{
  "hostNodeId": "abcdef1234",
  "displayName": "João",
  "gameBuild": "1.32.10.18820",
  "platform": "windows",
  "clientVersion": "0.1.0",
  "timestamp": 1784772000,
  "signature": "..."
}
```

Response:

```json
{
  "roomCode": "WOLF7K2M",
  "expiresAt": "2026-07-23T06:00:00Z",
  "sessionToken": "opaque-short-lived-token"
}
```

### Join room

```http
POST /v1/rooms/{roomCode}/join
```

Request:

```json
{
  "nodeId": "987654abcd",
  "displayName": "Arthur",
  "gameBuild": "1.32.10.18820",
  "platform": "linux",
  "clientVersion": "0.1.0"
}
```

Response:

```json
{
  "networkId": "16-character-network-id",
  "sessionToken": "opaque-short-lived-token",
  "expiresAt": "2026-07-23T06:00:00Z"
}
```

### Room events

```http
GET /v1/rooms/{roomCode}/events
Upgrade: websocket
Authorization: Bearer <session-token>
```

Event types:

```text
member.joined
member.left
member.ready
member.failed
room.launch
room.closed
room.expiring
```

### Update readiness

```http
PUT /v1/rooms/{roomCode}/members/me/status
Authorization: Bearer <session-token>
```

### Remove player

```http
DELETE /v1/rooms/{roomCode}/members/{nodeId}
Authorization: Bearer <host-session-token>
```

### Close room

```http
DELETE /v1/rooms/{roomCode}
Authorization: Bearer <host-session-token>
```

---

## 13. Room-Code Design

Room codes will use eight Crockford Base32 characters.

Example:

```text
WOLF-7K2M
```

Requirements:

- Exclude visually confusing characters.
- Approximately 40 bits of entropy.
- Case-insensitive.
- Valid for four hours.
- Maximum eight participants.
- Maximum five invalid join attempts per IP per minute.
- Additional rate limit per room code.
- Invalid-code responses must not disclose whether a similar room exists.
- Room codes must not contain the ZeroTier network ID.

Possession of the room code allows temporary participation. The host can optionally enable manual approval in a later release.

---

## 14. Host Authentication

A room must not be creatable by any arbitrary installation.

### MVP enrollment

1. The first host installation generates an Ed25519 key pair.
2. The private key is stored in the operating-system credential store or an encrypted local configuration accessible only to the user.
3. The host public key is registered in the Worker during owner setup.
4. Every create-room request is signed.
5. The Worker rejects expired timestamps, replayed nonces and unknown keys.

### Future capability

The owner may generate a one-time invitation to promote a trusted friend to host capability.

Players do not need host keys or accounts.

---

## 15. ZeroTier Membership Lifecycle

WarLink will use one private ZeroTier network for the MVP.

### Joining

1. Client sends its ZeroTier node ID to the Worker.
2. Worker validates the room.
3. Worker calls the ZeroTier Central API.
4. Worker adds or authorizes the member.
5. Client receives the network ID.
6. Local agent joins the network.
7. Client reports connectivity and managed IP.

ZeroTier documentation permits administrators to manually add a device by its node ID and then authorize it.

### Leaving

When a session ends:

- Temporarily added members are deauthorized.
- Members are deleted after a configurable grace period.
- The host member may remain authorized.
- Cleanup retries on transient ZeroTier API failures.
- A scheduled cleanup scans for stale room members.

### Capacity handling

The application must not hard-code a specific free-plan device limit.

ZeroTier’s currently published official pages are inconsistent: its getting-started documentation states that Central is free for up to 25 devices, while the current pricing page displays an Essential tier with 10 included devices. The deployment owner must verify the actual quota shown in the ZeroTier account. WarLink must catch capacity errors, delete stale temporary members, and display an actionable message.

---

## 16. Network and Firewall Behavior

WarLink will apply narrowly scoped temporary firewall permissions.

### Windows

- Identify the ZeroTier adapter by interface GUID, not translated display name.
- Mark or treat the interface as private when possible.
- Permit Warcraft traffic on the ZeroTier interface.
- Permit the WarLink diagnostic service on the ZeroTier interface.
- Avoid opening the same ports on public Wi-Fi or physical Ethernet interfaces.
- Record all created firewall rule identifiers.
- Remove rules on room exit or uninstall.

### Linux

- Detect `nftables`, `firewalld` or UFW.
- Prefer native `nftables` rules.
- Permit required traffic only on the active `zt*` interface.
- Track rules in a dedicated WarLink chain.
- Remove the chain on exit or uninstall.
- Never globally disable the firewall.

### Router configuration

WarLink must not ask users to:

- Forward ports.
- Configure DMZ.
- Expose Warcraft directly to the public internet.
- Change router firewall settings.

---

## 17. Connectivity Diagnostics

Before marking a player ready, WarLink must verify:

1. ZeroTier service is installed.
2. ZeroTier service is running.
3. Local node ID is available.
4. Network membership state is active.
5. A managed virtual IP was assigned.
6. Host is present in room state.
7. Host’s WarLink diagnostic endpoint is reachable over ZeroTier.
8. Round-trip latency can be measured.
9. Warcraft executable exists.
10. Warcraft build matches the room build.
11. Required firewall rule exists.
12. WebSocket connection to Cloudflare is active.

Statuses must use plain language.

Bad:

```text
ZT_NETWORK_ACCESS_DENIED
```

Good:

```text
This computer reached the network, but it has not been approved.
WarLink will retry automatically.
```

### Diagnostic results

```text
Connection: Direct
Latency: 42 ms
Network address: 10.147.20.4
Warcraft version: Match
Firewall: Ready
```

When ZeroTier uses a relay:

```text
Connection: Relayed
The game should work, but latency may be higher.
```

ZeroTier attempts peer-to-peer connections and can relay traffic when direct connectivity is unavailable.

---

## 18. Warcraft Integration

### Installation detection

Windows discovery order:

1. Existing WarLink configuration.
2. Running process path.
3. Common installation directories.
4. Relevant registry entries.
5. User-selected executable.

Linux discovery order:

1. Existing WarLink configuration.
2. Lutris configuration.
3. Bottles configuration.
4. Common Wine prefixes.
5. User-supplied launch command.

### Build verification

The host room declares:

```text
1.32.10.18820
```

WarLink checks:

- Executable metadata when available.
- Known file version information.
- A configurable manifest of expected file hashes.

A mismatch prevents automatic Ready status but may be overridden by the host.

### Map verification

Optional MVP feature:

1. Host selects the intended custom map.
2. WarLink computes SHA-256.
3. Players select or automatically locate their copy.
4. Hashes are compared.
5. WarLink reports Match or Mismatch.

WarLink will not automatically transfer maps in the MVP.

---

## 19. Security Requirements

1. ZeroTier Central API tokens must exist only as Cloudflare secrets.
2. The ZeroTier token must never appear in desktop logs or API responses.
3. Room tokens must be short-lived and room-scoped.
4. Host operations must be cryptographically signed.
5. Room codes must be rate-limited.
6. Room state must expire automatically.
7. Temporary ZeroTier members must be removed after use.
8. Firewall permissions must be restricted to the virtual interface.
9. The local privileged service must authenticate UI requests.
10. The control plane must never send arbitrary shell commands.
11. Launch events may launch only the locally configured Warcraft executable.
12. All control-plane traffic must use HTTPS or secure WebSockets.
13. Display names must be sanitized before rendering.
14. Node IDs must be treated as identifiers, not authentication secrets.
15. Logs must redact tokens, room credentials and Worker secrets.
16. Release manifests must be signed.
17. Downloaded dependencies must be signature- or checksum-verified.

ZeroTier network traffic is encrypted end-to-end and uses cryptographic device identities.

---

## 20. Privacy Requirements

The control plane may store:

- Display name.
- ZeroTier node ID.
- Platform.
- WarLink version.
- Warcraft build.
- Room membership timestamps.
- Readiness and coarse diagnostic state.

The control plane must not collect:

- Warcraft account credentials.
- Battle.net credentials.
- Files from the Warcraft installation.
- General browsing activity.
- Physical-network traffic.
- Public IP history beyond transient Cloudflare request processing.
- Chat messages.
- Hardware serial numbers.

Ephemeral room data should be deleted within 24 hours.

Analytics are opt-in for the private MVP. Local diagnostic logs remain on the user’s machine unless explicitly exported.

---

## 21. Error Handling

### Room not found

```text
That room code is invalid or has expired.
Check the code and try again.
```

### Network capacity reached

```text
The private game network is full.

The host needs to remove an old computer before another player can join.
```

### ZeroTier service missing

```text
WarLink needs to install its network component.

[ Install ]
```

### Authorization timeout

```text
WarLink is still approving this computer.

[ Retry ]  [ Show Details ]
```

### Host unreachable

```text
You joined the private network, but João’s computer is not reachable.

WarLink will check the firewall and connection automatically.
```

### Warcraft build mismatch

```text
Your version: 1.32.10.xxxxx
Room version: 1.32.10.18820

Everyone must use the same build.
```

### Lobby not visible

```text
The computers can communicate, but Warcraft did not discover the lobby.

Restart Warcraft after the network is connected.
If the problem continues, export a diagnostic report.
```

---

## 22. Reliability Requirements

- Joining and leaving operations must be idempotent.
- A desktop restart must restore an active room session when possible.
- A Worker retry must not create duplicate ZeroTier members.
- Room cleanup must retry failed API calls.
- Stale rooms must expire without the host being online.
- Firewall-rule cleanup must run after crashes on the next startup.
- The UI must remain responsive while networking operations run.
- The app must tolerate Cloudflare WebSocket reconnections.
- Existing ZeroTier connectivity should continue when the control plane temporarily becomes unavailable, although creating or joining new rooms will require the control plane.

ZeroTier states that its Central API is needed for provisioning and modification but does not affect basic connectivity between already configured network members.

---

## 23. Performance Requirements

At the expected private-group scale:

- Room creation: under 3 seconds.
- Member authorization: under 10 seconds under normal conditions.
- End-to-end join readiness: under 60 seconds after entering a valid code.
- UI response time: under 150 milliseconds for local actions.
- WebSocket player updates: under 2 seconds.
- Local agent idle memory: target under 50 MB.
- Control plane must carry zero Warcraft gameplay bytes.
- Cloudflare traffic should remain limited to small JSON messages and WebSocket events.

---

## 24. Observability

### Local logs

Components:

- UI.
- Privileged agent.
- ZeroTier adapter state.
- Firewall operations.
- Warcraft launch attempts.

Logs must use structured JSON internally and have a user-readable export format.

### Cloudflare logs

Record:

- Request ID.
- Endpoint.
- Response status.
- Room ID hash.
- Operation latency.
- ZeroTier API result category.
- Client version.
- Platform.
- Cleanup outcome.

Do not log:

- Room session tokens.
- API secrets.
- Full authorization headers.
- Host private keys.
- Warcraft filesystem paths.

### Diagnostic export

A user can click:

```text
Help → Export Diagnostic Report
```

The ZIP contains:

- WarLink version.
- Operating system.
- ZeroTier service status.
- Sanitized network status.
- Interface and firewall state.
- Game build information.
- Recent sanitized logs.

---

## 25. Deployment and Owner Setup

One technical owner completes this once.

### ZeroTier

1. Create a ZeroTier Central account.
2. Create one private network.
3. Enable managed IPv4 assignment.
4. Generate a dedicated Central API token.
5. Record the network ID.
6. Confirm the account’s actual device quota.

### Cloudflare

1. Create the Worker project.
2. Create the Room Durable Object binding.
3. Configure the Rate Limiting binding.
4. Store the following secrets:

```text
ZEROTIER_API_TOKEN
CONTROL_PLANE_SIGNING_KEY
OWNER_ENROLLMENT_SECRET
```

5. Configure the network ID as a nonsecret deployment value:

```text
ZEROTIER_NETWORK_ID
```

6. Bind a custom domain or use the generated Workers endpoint.
7. Deploy using Wrangler.
8. Enroll the owner’s host device.
9. Remove or rotate the one-time enrollment secret.

### Desktop release

1. Build signed Windows installer.
2. Build signed Debian package.
3. Publish signed release manifest.
4. Publish pinned dependency checksums.
5. Test a clean install on each supported OS.

---

## 26. MVP Acceptance Criteria

The MVP is complete when all of the following pass:

1. A Windows host on one home network creates a room.
2. A Windows player on another network joins using only the room code.
3. A Pop!\_OS or Ubuntu player on a third network joins using only the room code.
4. Neither player creates a ZeroTier account.
5. Neither player manually opens ZeroTier Central.
6. Neither player uses a terminal.
7. No router is manually configured.
8. All players receive a managed ZeroTier address.
9. All players can reach the host through the virtual network.
10. All players see the same readiness screen.
11. WarLink identifies a deliberate Warcraft build mismatch.
12. WarLink launches Warcraft on Windows.
13. WarLink launches Warcraft through a configured Wine/Lutris command on Linux.
14. The host-created Warcraft LAN lobby appears to both joiners.
15. Both joiners can enter the lobby and complete a test match.
16. Closing the room removes temporary ZeroTier authorization.
17. Closing the room removes temporary firewall rules.
18. The ZeroTier Central token cannot be recovered from either desktop installation.
19. Guessing room codes is rate-limited.
20. A crash followed by restart cleans up stale local state.

### Primary usability criterion

A first-time nontechnical Windows player must be able to go from installer to **Ready** in under three minutes, with no instructions beyond:

```text
Install this and enter WOLF-7K2M.
```

---

## 27. MVP Delivery Phases

### Phase 0: Networking proof of concept

Before building the polished UI:

- Test exact Warcraft build `1.32.10.18820`.
- Test one Windows host and one Linux client.
- Verify lobby discovery.
- Verify joining and gameplay.
- Document required firewall behavior.
- Confirm whether Warcraft must be restarted after ZeroTier connects.

**Exit condition:** Mixed-OS clients can discover and join the same lobby.

### Phase 1: Local Go prototype

Build a CLI that can:

- Read ZeroTier node identity.
- Join and leave a configured network.
- Read managed IP.
- Add and remove firewall rules.
- Perform host reachability tests.
- Launch Warcraft.

### Phase 2: Cloudflare control plane

Build:

- Room creation.
- Join flow.
- Central API authorization.
- Durable Object room state.
- WebSocket presence.
- Expiration and cleanup.
- Rate limiting.
- Host key enrollment.

### Phase 3: Desktop UI

Build Wails interfaces for:

- First-run setup.
- Host Game.
- Join Game.
- Ready screen.
- Diagnostics.
- Settings.

### Phase 4: Installers

Build:

- Windows installer and service.
- Debian package and systemd unit.
- Dependency verification.
- Upgrade and uninstall handling.

### Phase 5: Private beta

Test with:

- Multiple NAT types.
- Windows Defender Firewall.
- UFW and nftables.
- Wine.
- Lutris.
- Internet connections where ZeroTier must relay.
- Unexpected shutdowns.
- Expired rooms.
- Duplicate and stale members.

---

## 28. Major Risks

### Risk: Warcraft lobby discovery does not traverse ZeroTier reliably

**Mitigation:** Complete Phase 0 before building the full product.

If unicast connectivity works but LAN discovery does not, add a Phase 2.5 Warcraft discovery relay. The relay would forward only the necessary LAN announcement datagrams between WarLink agents over ZeroTier. It must not inspect or modify Warcraft binaries.

### Risk: ZeroTier upstream pricing or device quotas change

**Mitigation:**

- Do not hard-code plan capacity.
- Aggressively clean up stale devices.
- Surface quota failures clearly.
- Keep an abstraction around the ZeroTier control-plane provider.

### Risk: Linux launch environments vary significantly

**Mitigation:**

- Support Ubuntu/Pop!\_OS first.
- Provide presets for Wine, Lutris and Bottles.
- Store a user-confirmed launch command.
- Do not promise universal Linux detection.

### Risk: Security software blocks installation

**Mitigation:**

- Sign Windows binaries.
- Minimize privileged code.
- Publish source and checksums.
- Explain why the network service is required.
- Avoid process injection or game modification.

### Risk: ZeroTier redistribution terms are misunderstood

**Mitigation:**

- Download official signed packages during installation for the MVP.
- Include applicable license notices.
- Complete legal review before bundling binaries in a public installer.

### Risk: Room-code brute forcing

**Mitigation:**

- Eight-character random codes.
- Four-hour expiration.
- Per-IP and per-code rate limits.
- Maximum room capacity.
- Optional host approval in a later release.

---

## 29. Future Enhancements

- Trusted-friend host enrollment.
- Automatic custom-map synchronization for user-authorized maps.
- Warcraft-specific LAN discovery relay.
- Optional host approval for new players.
- macOS support.
- Fedora and Arch packages.
- Automatic direct-versus-relayed network visualization.
- Integrated voice-chat shortcut.
- Multiple isolated ZeroTier networks.
- Automatic temporary network creation.
- Self-hosted open-source networking provider.
- LAN games other than Warcraft III.
- QR codes and clickable room links.
- Discord invitation integration.
- Automatic update rollback.
- Cloudflare Access-protected administration dashboard.

---

## 30. Recommended Repository Structure

```text
warlink/
├── apps/
│   ├── desktop/
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── wails.json
│   └── agent/
│       ├── cmd/
│       ├── internal/
│       │   ├── firewall/
│       │   ├── launcher/
│       │   ├── zerotier/
│       │   └── ipc/
│       └── service/
├── cloudflare/
│   ├── src/
│   │   ├── worker.ts
│   │   ├── room-object.ts
│   │   ├── zerotier-client.ts
│   │   ├── authentication.ts
│   │   └── rate-limit.ts
│   ├── migrations/
│   └── wrangler.jsonc
├── packages/
│   ├── protocol/
│   └── release-manifest/
├── installers/
│   ├── windows/
│   └── debian/
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── network-lab/
├── docs/
│   ├── architecture.md
│   ├── troubleshooting.md
│   └── threat-model.md
└── README.md
```

---

## 31. Final Architecture Decision

Build WarLink with:

- **Go** for the desktop backend and privileged operating-system agent.
- **Wails + TypeScript** for the desktop interface.
- **Cloudflare Workers** for the API.
- **One Durable Object per room** for real-time room state.
- **Cloudflare Worker secrets** for the ZeroTier API token.
- **ZeroTier One** for peer-to-peer virtual Ethernet networking.
- **One reusable private ZeroTier network** for the MVP.
- **Temporary member authorization and automatic cleanup** for every room.
- **Official downloaded ZeroTier packages**, rather than initially embedding or forking ZeroTier.
- **No Cloudflare Tunnel, Spectrum, VPS, or game-traffic relay** in the initial architecture.

The most important first task is not the UI. It is a mixed-OS networking spike proving that Warcraft III `1.32.10.18820` lobby discovery and joining work between Windows and Linux over the selected ZeroTier configuration.
