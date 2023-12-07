import React, { useState, useEffect } from 'react';
import GuessInput from './GuessInput';
import GuessHistory from './GuessHistory';
import { useErrors } from '../../hooks';
import Errors from '../../components/Errors';
import { SERVER_URL } from '../../utils/constants';
import { useGame } from '../../context/GameContext';
import { useParams } from 'react-router-dom';
import Timer from './Timer';
import Players from './Players';
import { isLoggedIn } from '../../utils';
import Hints from './Hints';

const Game: React.FC = () => {
  const params = useParams();
  const id: number = Number(params.id);
  const errorsOptions = useErrors();
  const { errors, setErrors, useClearErrorsEffect } = errorsOptions;
  const { state, dispatch } = useGame();
  const guessInputState = useState<string>('')
  const [guessInput, setGuessInput] = guessInputState;
  const game = state?.games[Number(params.id)];
  const guesses = state?.guesses[Number(params.id)];
  const endsAt = game?.endsAt;
  useClearErrorsEffect(guessInput)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/v1/games/${id}`)
        if (res.ok) {
          const data = await res.json()
          dispatch({ type: 'ADD_GAME', payload: data })
        }

      } catch (error: any) {
        setErrors(error)
      }
    }

    fetchGame()

  }, []);

  if (!game || !guesses) {
    return <div>Loading game data...</div>
  }

  return (
    <div id='game' className='flex-evenly'>
      <div>
      
      <Timer endsAt={endsAt}/>
        {!isLoggedIn() && <Hints/>}
      </div>
      <div className='align-center flex-col'>

        <GuessInput errorsOptions={errorsOptions} guessInputState={guessInputState} />
        <div>Remaining Attempts: {game.numGuesses - Object.values(guesses)?.length}</div>
        <GuessHistory guesses={guesses} />
        <Errors errors={errors} />
      </div>
      <Players players={game?.players}/>
    </div>
  );
};

export default Game;
