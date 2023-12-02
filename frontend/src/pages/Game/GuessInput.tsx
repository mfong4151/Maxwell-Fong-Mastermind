import React, {useState} from 'react';

const GuessInput: React.FC = ({ }) => {
  const [guess, setGuess] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess"
      />
      <button type="submit">Submit Guess</button>
    </form>
  );
};

export default GuessInput;
