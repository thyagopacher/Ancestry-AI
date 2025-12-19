
export interface Person {
  name: string;
  role?: string;
  birthYear?: string;
  deathYear?: string;
  origin?: string;
  children?: Person[];
}

export interface TreeData extends Person {}

export interface SearchResult {
  tree: TreeData;
  sources: { title: string; uri: string }[];
}
