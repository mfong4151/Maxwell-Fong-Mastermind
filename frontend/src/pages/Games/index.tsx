import React from 'react';
import { useErrors } from '../../hooks';
import Errors from '../../components/Errors';
import MyGames from './MyGames';
import NewGameForm from '../../components/NewGameForm';

const Games: React.FC = () => {

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