import React from 'react';

interface Props{
    player: any
}
const PlayerItem:React.FC<Props> = ({player}) => {


    return (
        <li>
            {player.username}
        </li>
  
    );
};

export default PlayerItem;