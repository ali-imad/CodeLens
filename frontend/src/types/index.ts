export interface CodeSample {
  id: string;
  code: string;
  description: string;
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}
export interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  functionBody: string;
}
