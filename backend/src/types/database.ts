import type { Prisma, Game, GamePlayer} from '@prisma/client';

/*
    Because of the way that prisma implements foreign key checking on joins tables, 
    this type was made to produce cleaner queries
*/

export type gameGuessNoFK = Omit<Prisma.GameGuessCreateInput, 'game' | 'player'>

export interface GameWithPlayers extends Game{
    players: GamePlayer[]
}

export type CheckablePlayers = Pick<GamePlayer, 'id' | 'playerId'>