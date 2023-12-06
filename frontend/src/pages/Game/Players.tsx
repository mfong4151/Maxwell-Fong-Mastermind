import React from 'react';

interface Props{
    players?: any
}
const Players:React.FC<Props> = ({players}) => {
    console.log(players)
  return (
    <div id='' className=''>
        { players && players.length >  1
        ? <ul>


            </ul>
        : <h3>Solo Game</h3>

        
        }
    </div>
  );
};

export default Players;