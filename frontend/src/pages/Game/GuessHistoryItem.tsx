import React from "react";
import "./game.css";
import { Guess } from "../../types";

interface Props {
  guess: Guess
}

const GuessHistoryItem: React.FC<Props> = ({ guess }) => {
  const { numCorrectNum, numCorrectLoc, isGameWon, guesses, createdAt } = guess;
  const isAllIncorrect = !numCorrectNum && !numCorrectLoc
  const guessTime = new Date(createdAt)

  return (
    <li className="game-history-item">
      {isAllIncorrect
        ?
        <>
          <p className="guess-at">At: {guessTime.getHours()}:{guessTime.getMinutes()}:{guessTime.getSeconds()}</p>
          <p className="all-incorrect">All incorrect: {guesses}</p>
        </>
        :
        isGameWon
          ?
          <>
            <p className="you-won">YOU WON!</p>
            <p className="winning-combo">Winning combination: {guesses}</p>
          </>
          :
          <>
            <p className="guess-at">At: {guessTime.getHours()}:{guessTime.getMinutes()}:{guessTime.getSeconds()}</p>
            <p>{numCorrectNum} correct number(s) and {numCorrectLoc} correct location(s)</p>
            <p>Guess: {guesses}</p>
          </>
      }
      <p>{isGameWon}</p>
    </li>
  );
};

export default GuessHistoryItem;