import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import gameReducer from './GameReducer';
import { GameState } from './types';

interface Props{
    children: ReactNode;
}
const initialState: GameState = {
  sessionUser: {},
  users: {},
  games: {},
  guesses: {},
  
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

export const GameProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
