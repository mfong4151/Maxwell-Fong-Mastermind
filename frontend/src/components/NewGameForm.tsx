import React, { useState, FormEvent } from 'react';
import { jwtFetch, SERVER_URL} from '../utils';
import { useGame } from '../context/GameContext';
import ErrorsModal from './ErrorsModal';
import { useNavigate } from 'react-router-dom';
import EndsAtSelect from './EndsAtSelect';

const NewGameForm: React.FC = () => {
  const [num, setNum] = useState<number>(4);
  const [numGuesses, setNumGuesses] = useState<number>(10);
  const [endsAt, setEndsAt] = useState<number| null>(null);
  const {dispatch} = useGame();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body: any = {
      num,
      numGuesses
    }

    if (endsAt){
      body.endsAt = endsAt
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
            <label htmlFor="numGuesses">Attempts:</label>
            <input
              type="number"
              id="num-guesses"
              value={numGuesses}
              onChange={e => setNumGuesses(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="endsAt">Time Limit (optional):</label>
            <EndsAtSelect endsAt={endsAt} setEndsAt={setEndsAt}/>
          </div>
        </div>
        <button type="submit">Start New Game</button>
      </form>
      <ErrorsModal errors={errors} setErrors={setErrors}/>
    </div>
  );
};

export default NewGameForm;