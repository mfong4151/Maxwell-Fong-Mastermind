import React from "react";
import { Game } from "../../types";
import "./games.css";
import { useNavigate } from "react-router-dom";

interface Props{
    game: Game;
};

const MyGameItem:React.FC<Props> = ({game}) => {
    const {id, numGuesses, roundNo, numPlayers, endsAt} = game;
    const endDateTime: Date | null = endsAt ? new Date(endsAt) : null 


    const navigate = useNavigate();
    
    const handleOnClick = (e:any):void => {

        if(numPlayers > 1){
            navigate(`/lobby/${id}`)
        } else{
            navigate(`/game/${id}`)    
        }
    }

    return (
        <li className="flex-between align-center game-item">
            <div className="flex-col game-item-about ">
                <div className="flex-between">
                <p>Game no: {id} </p>
                <p>Rounds: {roundNo}/{numGuesses}</p>
                <p>Players: {numPlayers} </p>

                </div>
                <div className="flex-center">
                    { endDateTime && 
                    `Ends on: ${endDateTime?.getFullYear()}/${endDateTime?.getMonth() + 1}/${endDateTime.getDate()},
                    ${endDateTime?.getHours()}:${endDateTime?.getMinutes()}:${endDateTime?.getSeconds()}
                    `
                    }
                </div>
                
            </div>
            <button onClick={handleOnClick}>
                Play
            </button>
        </li> 
    );
};

export default MyGameItem;