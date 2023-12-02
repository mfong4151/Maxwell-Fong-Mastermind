import React, { useState, useEffect } from 'react';
import GuessInput from './GuessInput';
import GuessHistory from './GuessHistory';
import { useErrors } from '../../hooks';
import Errors from '../../components/Errors';
import { SERVER_URL } from '../../utils/constants';
import { useGame } from '../../context/GameContext';
import { useParams } from 'react-router-dom';

const Game: React.FC = () => {
  const params = useParams()
  const {errors, setErrors, useClearErrorsEffect} = useErrors()
  const {state, dispatch} = useGame()
  const gameData = state?.games[Number(params.id)];

  useEffect(() => {
    const fetchGame = async() =>{
      try {
        const res = await fetch(`${SERVER_URL}/api/v1/games/${12}`)
        if(res.ok){
          const data = await res.json()
          dispatch({type: 'ADD_GAME', payload: data })
        }

      } catch (error: any) {
        setErrors(error)
      }
    }
    
    fetchGame()

  }, []);

  if(!(gameData)){
    return <div>Loading game data...</div>
  }

  const {remainingGuesses, numCorrectLoc, numCorrectNum, isGameWon} = gameData;
  const handleSubmit = async () => {
    // API call to submit guess and update state
  };

  return (
    <div>
      <GuessInput />
      {/* <GuessHistory history={guessHistory} feedback={feedback} /> */}
      <div>Remaining Attempts: {remainingGuesses}</div>
      <Errors errors={errors}/>
    </div>
  );
};

export default Game;
