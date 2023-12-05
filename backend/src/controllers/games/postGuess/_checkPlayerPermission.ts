import { CheckablePlayers } from "../../../types"

//Checks if the player is allowed to play in this game.
//If there is no players array given, then this means it was an unsigned in player game
//If there is, then we need to do a linear pass to see if the player exists in the array.
export const _isPlayerPermitted = (gamePlayers: CheckablePlayers[] = [], currPlayerId: number): boolean =>
(
        !!gamePlayers.length &&  
        gamePlayers.some(
            (player: CheckablePlayers) => player.playerId === currPlayerId
        )
)
    
        
        