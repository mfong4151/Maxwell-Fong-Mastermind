import React, { useState, useEffect } from "react";
import Game from "../Game";
import { socket } from "../../utils/socket";
import { useGame } from "../../context/GameContext";
import { useParams } from "react-router-dom";
import { ADD_GUESS } from "../../context/GameReducer";

const Lobby: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const { dispatch} = useGame() 
  const params = useParams()
  const lobbyId  = Number(params.id);

  
  useEffect(() => {
    socket.connect()
    socket.emit("joinRoom", lobbyId)
    socket.on("recieveGuess", guess => {
      dispatch(guess.dispatch)
    }

    )
    return () => {
      socket.disconnect()
    };
  }, [])
  return (<>
    <Game />
  </>
  );
};

export default Lobby;