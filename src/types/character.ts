export interface ApiCharacter {
  key: string;
  name: string;
  element: string;
  weaponType: {
    key: string;
    name: string;
  };
  rarity: number;
  nation: string;
}

export interface UserCharacter {
  id: number;
  definitionKey: string;
  level: number;
  constellation: number;
  friendship: number;
  ascension: number;
  normalAttackLevel: number;
  elementalSkillLevel: number;
  elementalBurstLevel: number;
  isPreferred: boolean;
}

export interface Weapon {
  id: number;
  key: string;
  name: string;
  level: number;
  refinement: number;
}

export interface ArtifactSubStat {
  key: string;
  name: string;
  value: number;
}

export interface Artifact {
  id: number;
  set: {
    key: string;
    name: string;
  };
  slot: {
    key: string;
    name: string;
  };
  mainStat: {
    key: string;
    name: string;
    value: number;
  };
  subStats: ArtifactSubStat[];
  level: number;
}

export interface ArtifactLoadout {
  id: number;
  name: string;
  description: string | null;
  artifacts: Artifact[];
}

export interface BuildGuide {
  id: number;
  name: string;
  description: string | null;
}

export interface UserLoadout {
  id: number;
  name: string;
  description: string | null;
  isPreferred: boolean;

  character: {
    id: number;
    name: string;
  } | null;

  weapon: Weapon | null;

  artifactLoadout: ArtifactLoadout | null;

  buildGuides: BuildGuide[];
}