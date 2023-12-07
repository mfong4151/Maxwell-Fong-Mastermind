import React, { useState } from 'react';
import { SERVER_URL, jwtFetch } from '../../utils';
import { useLocation, useParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ADD_GUESS } from '../../context/GameReducer';
import { ErrorsOptions, StateSetter } from '../../types';
import { socket } from '../../utils/socket';

interface Props{
  errorsOptions: ErrorsOptions; 
  guessInputState: [string, StateSetter<string>]
}

const GuessInput: React.FC<Props> = ({errorsOptions, guessInputState }) => {
  const {setErrors} = errorsOptions;
  const [guess, setGuess] = guessInputState;
  const { id } = useParams();
  const {dispatch} = useGame();
  const location = useLocation()
  console.log(location)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const body = {
      guesses: guess.split('')
    }

    try {
      const res = await jwtFetch(
        `${SERVER_URL}/api/v1/games/${id}/guesses`,
        body,
        'POST'
      );
      const data = await res.json();
      if (res.ok) {
        dispatch({type: ADD_GUESS, payload: data})
        if(socket.connected){
            socket.emit('guess', ({dispatch:{type: ADD_GUESS, payload: data}, user: socket.id}))

        }
      }

      setErrors(data.errors)
    } catch (error: any) {
      setErrors([error])
    }

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
