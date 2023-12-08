import React from "react";


const MultiplayerInvite:React.FC = () => {

  return (
    <div id="" className="">
        <h3>Add a Player to Your Game</h3>
        <form action="">
            <div>
                <label htmlFor="playerId">
                    PlayerId:
                </label>
                <input type="number" />
            </div>
            <div>
                <label htmlFor="gameId">
                    GameId:
                </label>
                <input type="number" />
            </div>
            <button>
                Add to game 
            </button>

        </form>

    </div>
  );
};

export default MultiplayerInvite;