//RESPONSE de /api/characters/
export interface Character {
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

//RESPONSE de /api/user/characters/
export interface UserCharacter {
  id: number;
  definitionKey: string;
  userId: number;
  level: number;
  constellation: number;
  friendship: number;
  ascension: number;
  normalAttackLevel: number;
  elementalSkillLevel: number;
  elementalBurstLevel: number;
  isPreferred: boolean;
  definition: {
    key: string;
    element: string;
    rarity: number;
  };
}

/*export interface UserCharacter {
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

export interface ApiUserCharacter {
  id: number;
  definitionKey: string;
  level: number;
  ascension: number;
  normalAttackLevel: number;
  elementalSkillLevel: number;
  elementalBurstLevel: number;
  definition: {
    key: string;
    element: string;
    rarity: number;
  };
}*/