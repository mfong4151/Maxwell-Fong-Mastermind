import React from "react";

interface Props {
  wins: number;
  total: number;
}
const WinLoss: React.FC<Props> = ({ wins, total }) => {
  return (
    <div className="flex-center">
      <p>
        {`Wins: ${wins ? wins: 0} Total Games: ${total ? total: 0}`}
      </p>
    </div>

  );
};

export default WinLoss;