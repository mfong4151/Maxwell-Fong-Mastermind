import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SERVER_URL, jwtFetch } from '../../utils';
import { ADD_GAMES } from '../../context/GameReducer';
import { get } from 'http';
import MyGameItem from './MyGameItem';

const MyGames: React.FC = () => {
    const {state, dispatch} = useGame();
    const {games} = state; 

    useEffect(() => {

        const getUsersGames = async() =>{
            try {
                const res = await jwtFetch(`${SERVER_URL}/api/v1/users/games`);

                if (res.ok){
                    const body = await res.json();
                    dispatch({type: ADD_GAMES, payload: body})
                }

            } catch (error) {
                
            }
            
        }
        
        getUsersGames()
        
    }, [dispatch]);

    return ( 
    <ul id='game-items'>

        {Object.values(games).map((game: any, idx: number) => (
            <MyGameItem key={idx} game={game}/> 
        ))}
    </ul>
  );
};

export default MyGames;
