import React from "react";
import NewGameForm from "../../components/NewGameForm";

const LoginlessPlay:React.FC = () => {


  return (
    <div id="" className="flex-center flex-col">
        <h2>Or, play without logging in!</h2>
        <h3>You get access to hints!</h3>
        <NewGameForm/>

    </div>
  );
};

export default LoginlessPlay;