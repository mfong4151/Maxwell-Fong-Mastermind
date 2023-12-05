import React from 'react';
import './game.css';
import { Guess } from '../../types';

interface Props {
  guess: Guess
}

const GuessHistoryItem: React.FC<Props> = ({ guess }) => {
  const { numCorrectNum, numCorrectLoc, isGameWon, guesses } = guess;
  const isAllIncorrect = !numCorrectNum && !numCorrectLoc

  return (
    <li className='guess-history-item'>
      {isAllIncorrect
        ?
        <p>All incorrect</p>
        :
        isGameWon
          ?
          <>
            <p>YOU WON!</p>
            <p>Winning combination: {guesses}</p>
          </>
          :
          <>
            <p>{numCorrectNum} correct number(s) and {numCorrectLoc} correct location(s)</p>
            <p>Guess: {guesses}</p>
          </>
      }
      <p>{isGameWon}</p>
    </li>
  );
};

export default GuessHistoryItem;