
export interface Game {
    id: number;
    numGuesses: number;
    secretCode: string[];
    guesses: Guess[];
    createdAt: string;
    _count: {
        players: number
    };
}

export interface Guess {
    id: number;
    gameId: number;
    isGameWon: boolean;
    numCorrectLoc: number;
    numCorrectNum: number;
    guesses: string[];
}
