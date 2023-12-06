
export interface Game {
    id: number;
    numGuesses: number;
    secretCode: string[];
    guesses: Guess[];
    createdAt: string;
    endsAt?: Date | null;
    roundNo: number,
    numPlayers: number
    remainingGuesses: number 
}

export interface Guess {
    id: number;
    gameId: number;
    isGameWon: boolean;
    numCorrectLoc: number;
    numCorrectNum: number;
    guesses: string[];
}
