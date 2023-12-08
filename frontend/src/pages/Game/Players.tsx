import React from "react";
import PlayerItem from "./PlayerItem";

interface Props {
    players?: any
}
const Players: React.FC<Props> = ({ players }) => {

    return (
        <div id="" className="">
            {players && players.length > 1
                ?
                <>
                    <h3>Game players</h3>
                    <ul>
                        {players.map((player: any, idx: number) =>
                            <PlayerItem key={idx} player={player.player} />

                        )}


                    </ul>
                </>
                : <h3>Solo Game</h3>
            }
        </div>
    );
};

export default Players;