import { Game, GamePlayer, User } from "@prisma/client";
import { LRUCache } from "lru-cache";
import { GameConfig, GameWithPlayers } from "../../types";

const LRU_OPTIONS = {
    max: 500
}

//In the case of players, we only ever want to cache their id, this we keep in a set
//We cache the players ids against the game
export const lruGames: LRUCache<number, any> = new LRUCache<number, GameWithPlayers>(LRU_OPTIONS);
export const lruPlayers: LRUCache<number, any> = new LRUCache<number, Set<number>>(LRU_OPTIONS)

//Used to cache players set
export const handleCachePlayers = (game: GameConfig): Set<number> =>{
    const gamePlayers = lruPlayers.get(game.id)

    if(!gamePlayers){
        const playersValue = new Set(game.players.map((player: any) => player.playerId))
        lruPlayers.set(game.id, playersValue )
        return playersValue
    }
    return gamePlayers   
}