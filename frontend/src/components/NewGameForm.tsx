import React, { useState, FormEvent } from 'react';
import { jwtFetch, SERVER_URL} from '../utils';
import { useGame } from '../context/GameContext';
import ErrorsModal from './ErrorsModal';
import { useNavigate } from 'react-router-dom';

const NewGameForm: React.FC = () => {
  const [num, setNum] = useState<number>(4);
  const [numGuesses, setNumGuesses] = useState<number>(10);
  const {dispatch} = useGame();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      num,
      numGuesses
    }

    try {
      const res = await jwtFetch(`${SERVER_URL}/api/v1/games`, body, 'POST')
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'ADD_GAME', payload: data })
        navigate(`/game/${data.id}`)
      } else {
        setErrors(data.errors)
      }
    } catch (error: any) {
      setErrors(['Issues connecting to the server'])
    }
  };

  return (
    <div>
      <h2>Single Player Mode</h2>
      <form onSubmit={handleSubmit}>
        <div className='flex-col'>
          <div>
            <label htmlFor="num">Code Length:</label>
            <input
              type="number"
              id="num"
              value={num}
              onChange={(e) => setNum(parseInt(e.target.value))}
              min="4"
            />
          </div>
          <div>
            <label htmlFor="numGuesses">Attempts</label>
            <input
              type="number"
              id="num-guesses"
              value={numGuesses}
              onChange={e => setNumGuesses(parseInt(e.target.value))}
            />
          </div>
        </div>
        <button type="submit">Start New Game</button>
      </form>
      <ErrorsModal errors={errors} setErrors={setErrors}/>
    </div>
  );
};

export default NewGameForm;