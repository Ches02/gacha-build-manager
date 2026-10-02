import type { UserWeapon } from "./weapon";
import type { BuildGuide } from "./buildGuide";
import type { UserArtifact } from "./artifact";
import type { UserCharacter } from "./character";

export interface UserLoadout {
  id: number;
  name: string;
  description: string | null;
  isPreferred: boolean;

  character: UserCharacter | null;

  weapon: UserWeapon | null;

  artifactLoadout: ArtifactLoadout | null;

  buildGuides: BuildGuide[];
}

export interface ArtifactLoadout {
  id: number;
  name: string;
  description: string | null;
  artifacts: UserArtifact[];
}