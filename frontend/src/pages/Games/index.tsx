import React, { useEffect } from 'react';
import { useErrors } from '../../hooks';
import Errors from '../../components/Errors';
import MyGames from './MyGames';
import NewGameForm from '../../components/NewGameForm';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils';

const Games: React.FC = () => {
  const navigate = useNavigate()
  useEffect(()=> {

    if(!isLoggedIn()){
    navigate('/login')
  }
  })
  return (
    <div>
      <div className='flex-between'>
        <MyGames/>

        <div id='games-right'>
          <h2>Single Player Mode</h2>

          <NewGameForm/>

        </div>
      </div>
 
    </div>
  );
};

export default Games;