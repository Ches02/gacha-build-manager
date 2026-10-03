export interface Material {
  materialKey: string;
  name: string;
  type: string;
}

export interface MaterialRequirement extends Material {
  quantity: number;
}

export interface MaterialCategory {
  materials: MaterialRequirement[];
}