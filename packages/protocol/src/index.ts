export const SUPPORTED_GAME_BUILD = "1.32.10.18820" as const;
export const MAX_ROOM_PARTICIPANTS = 8 as const;

export type Platform = "windows" | "linux";

export type RoomEventType =
  | "member.joined"
  | "member.left"
  | "member.ready"
  | "member.failed"
  | "room.launch"
  | "room.closed"
  | "room.expiring";

export interface ClientIdentity {
  displayName: string;
  gameBuild: string;
  platform: Platform;
  clientVersion: string;
}

export interface JoinRoomRequest extends ClientIdentity {
  nodeId: string;
}

export interface JoinRoomResponse {
  networkId: string;
  sessionToken: string;
  expiresAt: string;
}

const normalizedRoomCodePattern = /^[0-9A-HJKMNP-TV-Z]{8}$/;

export function normalizeRoomCode(value: string): string | null {
  const normalized = value.trim().replaceAll("-", "").toUpperCase();
  return normalizedRoomCodePattern.test(normalized) ? normalized : null;
}

export function formatRoomCode(value: string): string | null {
  const normalized = normalizeRoomCode(value);
  return normalized ? `${normalized.slice(0, 4)}-${normalized.slice(4)}` : null;
}
