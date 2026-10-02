//RESPONSE de /api/artifact-sets/
export interface ArtifactSet {
  key: string;
  name: string;
  twoPiecesEffect: string;
  fourPiecesEffect: string;
}

//RESPONSE de /api/user/artifacts/
export interface UserArtifact {
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
  userId: number;
}

export interface ArtifactSubStat {
  key: string;
  name: string;
  value: number;
}
