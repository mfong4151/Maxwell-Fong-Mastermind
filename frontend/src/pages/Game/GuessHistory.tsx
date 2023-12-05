import React from 'react';
import GuessHistoryItem from './GuessHistoryItem';
import type { Guess } from '../../types';
import './game.css';

interface Props {
    guesses: Record<number, Guess>;
}

const GuessHistory: React.FC<Props> = ({ guesses }) => {

    return (
      <div>
        <h2>Guess History</h2>
        <ul id='game-history'>
            {
              Object.values(guesses).map((guess: Guess, idx: number) => (
                <GuessHistoryItem key={idx} guess={guess}/> 
              ))
            }
            
      
        </ul>
    </div>
  );
};

export default GuessHistory;
