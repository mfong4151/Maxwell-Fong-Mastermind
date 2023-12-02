import React, { useState, FormEvent } from 'react';

const NewGame: React.FC = () => {
  const [num, setNum] = useState<number>(4); 

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="num">Number of Characters in Code:</label>
        <input
          type="number"
          id="num"
          value={num}
          onChange={(e) => setNum(parseInt(e.target.value))}
          min="0"
          max="7"
        />
      </div>
      <button type="submit">Start New Game</button>
    </form>
  );
};

export default NewGame;
