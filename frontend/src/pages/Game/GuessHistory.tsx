import React from 'react';

interface Props {
  history: string[];
  feedback: string[];
}

const GuessHistory: React.FC<Props> = ({ history, feedback }) => {
  return (
    <div>
      <h2>Guess History</h2>
      <ul>
        {history.map((guess, index) => (
          <li key={index}>
            {guess} - Feedback: {feedback[index]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuessHistory;
