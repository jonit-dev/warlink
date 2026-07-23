export type ReleasePlatform = "windows-x64" | "linux-x64";

export interface ReleaseArtifact {
  platform: ReleasePlatform;
  url: string;
  sha256: string;
  size: number;
}

export interface ReleaseManifest {
  schemaVersion: 1;
  version: string;
  publishedAt: string;
  artifacts: readonly ReleaseArtifact[];
  signature: string;
}
