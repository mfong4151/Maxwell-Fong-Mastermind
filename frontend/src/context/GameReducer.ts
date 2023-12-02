// gameReducer.ts
import { GameState, GameAction } from './types';

const initialState: GameState = {
  users: {},
  session: false,
  games: {
    
  },
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, session: true };

    case 'LOGOUT':
      return { ...initialState, session: false };

    case 'ADD_GAMES':
      return {...state, games: {...state.games}}

    case 'ADD_GAME':
      const id = action.payload.id;
      const newGames = {...state.games}
      newGames[id] = action.payload
      return {...state, games: newGames }

    case 'UPDATE_GAME':
      return { ...state, games: action.payload };

  
    default:
      return state;
  }
};

export default gameReducer;
