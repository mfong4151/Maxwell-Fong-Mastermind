export interface User {
  id: number;
  username: string;
}

export interface Game {
  id: number;
  remainingGuesses: number;
  secretCode: string[];
  numCorrectLoc: number;
  numCorrectNum: number;
  isGameWon: boolean;
  guessHistory: string[];
} 

export interface GameState {
  users: any;
  session: any;
  games: any;
}

export type GameAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | {type: 'ADD_GAMES'; payload: Game[]}
  | { type: 'ADD_GAME'; payload: Game }
  | { type: 'UPDATE_GAME'; payload: Game }
  | { type: 'END_GAME' };
