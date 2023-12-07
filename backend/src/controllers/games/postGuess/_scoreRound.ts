import { gameGuessNoFK } from "../../../types";

interface CorrectNums{
    numCorrectLoc: number;
    numCorrectNum: number;
}

//Assumes that secret code and guesses are the same length. (see _checkGamePlayable.ts)
export const _scoreRound = (secretCode: string[],guesses: string[]): gameGuessNoFK => {
  
    const {numCorrectLoc, numCorrectNum}: CorrectNums  =_scoreCorrectNums(secretCode, guesses);

    //If the game is won, then we return it on the latest guess
    const isGameWon = numCorrectLoc === numCorrectNum && numCorrectLoc === guesses.length;
    
    //Return the new game state
    return {numCorrectLoc, numCorrectNum, isGameWon, guesses}
}

/*
    Two pass solution: go through and get all of the correct numbers, from that point loc === num
    While we do ^, go through and make a count obj, and an array of the unmatched items.
    Then we only diff the count hash and the remaining members of the secret code
*/ 

export const _scoreCorrectNums = (secretCode: string[], guesses: string[]): CorrectNums=>{
    let numCorrectLoc: number = 0, numCorrectNum: number;
    const unmatchedSecret: {[key: string]: number} = {};
    const unmatchedGuess: string[] = []

    for(let i: number = 0; i < secretCode.length; i++){
        const code: string = secretCode[i];
        const guess: string = guesses[i];

        if (code === guess){
            numCorrectLoc ++
        } else {
            unmatchedSecret[code] = 1 ??  unmatchedSecret[code] + 1;
            unmatchedGuess.push(guess)
        }
    }

    //Compare unmatched items
    numCorrectNum = numCorrectLoc;

    //Big-O optimization, if we know that numCorrectLoc is === length of the code, skip the nested loop
    if (numCorrectLoc !== secretCode.length){
        for (const guess of unmatchedGuess){
            if (unmatchedSecret[guess] && unmatchedSecret[guess] > 0){
                numCorrectNum ++
                unmatchedSecret[guess] --
            }
        }
    }
    
    return {numCorrectNum, numCorrectLoc}
}