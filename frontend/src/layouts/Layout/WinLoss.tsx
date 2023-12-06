import React from 'react';

interface Props{
    wins: number;
    total: number;
}
const WinLoss:React.FC<Props> = ({wins, total}) => {
  return (
    <p>
        {`Wins: ${wins} Total Games: ${total}`}
    </p>
    
  );
};

export default WinLoss;