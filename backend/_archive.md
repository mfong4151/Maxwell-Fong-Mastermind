Archive file for depreciated code.
```typescript
//Depreciated in favor of raw query, see 
export const _findGamesByUserIdPrisma = (userId: number): Promise<Partial<Game>[]> => (
    prisma.game.findMany({
        where: {
            players:{
                some:{
                    playerId: userId
                }
            }
        },
        select: {
            id: true,
            numGuesses: true,
            _count: {
                select:{
                    players: true
                }
            },
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })
)
```