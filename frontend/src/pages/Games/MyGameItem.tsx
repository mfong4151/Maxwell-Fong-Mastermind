import React from 'react';
import { Game } from '../../types';
import './games.css';
import { useNavigate } from 'react-router-dom';

interface Props{
    game: Game
}
const MyGameItem:React.FC<Props> = ({game}) => {
    const {id, numGuesses, roundNo, numPlayers } = game;
    const navigate = useNavigate();

    const handleOnClick = (e:any):void => {
        navigate(`/game/${id}`)    
    }

    return (
        <li className='flex-between align-center game-item'>
            <div className='flex-between align-center game-item-about'>
                <p>Game no: {id} </p>
                <p>Rounds: {roundNo}/{numGuesses}</p>
                <p>Players: {numPlayers} </p>
            </div>
            <button onClick={handleOnClick}>
                Play
            </button>
        </li> 
    );
};

export default MyGameItem;