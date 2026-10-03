//RESPONSE de /api/weapons/
export interface Weapon {
  key: string;
  name: string;
  baseStat: {
    key: string;
    name: string;
    value: number;
  },
  subStat: {
    key: string;
    name: string;
    value: number;
  }| null;
  effect: string;
  type: {
    key: string;
    name: string;
  };
  rarity: number;
  obtainType: string;
}


//RESPONSE de /api/user/weapons/
export interface UserWeapon {
  id: number;
  definitionKey: string;
  level: number;
  refinement: number;
  userId: number;
  definition: {
    key: string;
    rarity: number;
    baseATK: number;
    subStatTypeKey: string | null;
    subStat: number | null;
    weaponTypeKey: string;
    obtainType: string;
  };
}