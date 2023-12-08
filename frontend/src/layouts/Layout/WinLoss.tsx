import React from "react";

interface Props {
  wins: number;
  total: number;
}
const WinLoss: React.FC<Props> = ({ wins, total }) => {
  return (
    <div className="flex-center">
      <p>
        {`Wins: ${wins} Total Games: ${total}`}
      </p>
    </div>

  );
};

export default WinLoss;