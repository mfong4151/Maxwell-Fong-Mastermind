import React, { useEffect } from "react";
import { SERVER_URL, isLoggedIn, jwtFetch, logout } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useErrors } from "../../hooks";
import { useGame } from "../../context/GameContext";
import { ADD_SESSION_USER } from "../../context/GameReducer";
import WinLoss from "./WinLoss";
interface Props{

}
const Header:React.FC<Props> = () => {
  const navigate = useNavigate()
  const errorsOptions =  useErrors();
  const setErrors = errorsOptions.setErrors;
  const {state, dispatch} =  useGame();

  const handleOnClick = (e:any):void => {
    const id  = e.target.id;
    
    if (id === "login"){
      navigate("/login")      
    }else{
      logout()
      navigate("/login")
    }
  }
  const handleGoHome = (e: any): void =>{
    if(isLoggedIn()){
      navigate("/games")
    }    

  }

  useEffect(()=>{
    const getProfile = async() => {
      try {
          const res = await jwtFetch(`${SERVER_URL}/api/v1/users/profiles`);
          const data = await res.json();
          if (res.ok){
              dispatch({type: ADD_SESSION_USER, payload: data})              
          }
          
          setErrors(data.errors)
      } catch (error: any) {
          setErrors([error])
      }

    }

    getProfile();
  }, [])

  return (
    <header className="padding-default flex-between">
      <span className="cursor-events" onClick={handleGoHome}>
        Mastermind
      </span>

      <div>
        { 
          isLoggedIn() 
          ?
            <>
            <span>Hello {state?.sessionUser?.username}</span>
            <button id="logout" onClick={handleOnClick}>
              Log out
            </button>
            <WinLoss wins={state?.sessionUser?.gamesWon} total={state?.sessionUser?.totalGames} /> 
            </>
          :
            <button id="login" onClick={handleOnClick}>
               Log in 
            </button>
        }

      </div>
    </header>
  );
};

export default Header;