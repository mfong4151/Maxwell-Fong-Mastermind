import { findConfigById } from "../../database/game";
import { handleCachePlayers, lruGames, lruPlayers } from "../utils";
import { findPlayersByGameId } from "../../database/gamePlayers";
import type { PlayerId, GameConfig} from "../../types";

//Convention "retrieve" used to mark that this uses a cache.
//Contrast with "find" which I use to mark getting from the database.
export const retrieveGameConfig = async (gameId: number): Promise<GameConfig | null> => {
    const cachedGame: GameConfig | undefined = lruGames.get(gameId);

    if (!cachedGame){
        const gameConfig: Awaited<GameConfig| null > = await findConfigById(gameId);
        
        if (!gameConfig){
            return null;
        }

        lruGames.set(gameConfig.id, gameConfig)
        return gameConfig;
    }
    
    return cachedGame;
}

export const retrievePlayers = async (gameId: number): Promise<Set<number> | null> =>{
    const cachedPlayerIds: Set<number> = lruPlayers.get(gameId);

    if (!cachedPlayerIds){    
        const players: Awaited<PlayerId[]> =  await findPlayersByGameId(gameId);
        if (!players.length){
            return null;
        }

        return handleCachePlayers(players);

    }

    return cachedPlayerIds;

}