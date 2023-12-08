import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    const numGuesses = i + 1; 
    const game = await prisma.game.create({
      data: {
        numGuesses,
        secretCode: Array(4).fill(String(Math.floor(Math.random() * 8))),
        players: {
          create: [{
            player: { connect: { id: 1 } }
          }],
        },
        guesses: {
          create: [...Array(i).keys()].map(k => ({
            playerId: 1,
            numCorrectLoc: 0, 
            numCorrectNum: 0, 
            guesses: Array(4).fill(String(Math.floor(Math.random() * 8))), 
            isGameWon: [true, false][Math.floor(Math.random() * 2)], 
          })),
        },
      },
    });
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
