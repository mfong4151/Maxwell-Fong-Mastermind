export interface User {
  id: number;
  username: string;
}

export interface GameState {
  sessionUser: any;
  users: any;
  games: any;
  guesses: any;
}

export interface GameAction {
    type: string,
    payload: any
}
