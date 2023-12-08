// gameReducer.ts
import type{ GameState, GameAction } from "./types";
import type { Game, Guess } from "../types";
export const ADD_GAME: string = "ADD_GAME";
export const ADD_GAMES: string = "ADD_GAMES";
export const ADD_GUESS: string = "ADD_GUESS";
export const ADD_SESSION_USER: string = "ADD_SESSION_USER";

const initialState: GameState = {
  sessionUser: {},
  users: {},
  games: {},
  guesses: {},
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case ADD_SESSION_USER: 
      return {...state, sessionUser: action.payload}
    case ADD_GAMES:
      return {...state, games: {...state.games, ...action.payload}}

    case ADD_GAME: {

      const game: Game = action.payload;
      const gameId: number = game.id;
      const guesses = Object.assign({}, game.guesses)
      return {...state, 
        games: {...state.games, [gameId]: game},
        guesses: { [gameId]: guesses}
      }
    }
    
    case ADD_GUESS:{

      const guess: Guess = action.payload;
      const gameId = guess.gameId;
      const guesses = state.guesses;
      guesses[gameId][guess.id] = guess;
      return {...state, guesses }
    }

    default:
      return state;
  }
};

export default gameReducer;
