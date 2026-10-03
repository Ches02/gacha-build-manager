//RESPONSE de /api/user/build-guides/
export interface BuildGuide {
  id: number;
  name: string;
  description: string | null;

  character: {
    key: string;
    name: string;
  }[];

  weapons: {
    key: string;
    name: string;
  }[];

  artifactSets: {
    key: string;
    name: string;
    pieces: number;
  }[];

  mainStats: {
    slot: {
      key: string;
      name: string;
    };
    stat: {
      key: string;
      name: string;
    };
  }[];

  statPriorities: {
    priority: number;
    stat: {
      key: string;
      name: string;
    };
    targetValue: number;
  }[];
}