import { _scoreCorrectNums } from "../src/controllers/games/postGuess/_scoreRound";
import 'mocha';
import {expect} from 'chai';

describe('Score round tests', () => {
    const secretCode = ['0', '1', '3', '5'];
    const guess1 = ['2', '2', '4', '6'];
    const guess2 = ['0','2','4', '6'];
    const guess3 = ['2','2','1', '1'];
    const guess4 = ['0','1','5', '6'];

    it('0 correct numbers and 0 correct locations', () => {
        expect(_scoreCorrectNums(secretCode, guess1)).to.deep.equal({numCorrectLoc: 0, numCorrectNum: 0 });
    });
    it('1 correct number and 1 correct location', () => {
        expect(_scoreCorrectNums(secretCode, guess2)).to.deep.equal({numCorrectLoc: 1, numCorrectNum: 1 });
    });
    it('1 correct number and 0 correct location', () => {
        expect(_scoreCorrectNums(secretCode, guess3)).to.deep.equal({numCorrectLoc: 0, numCorrectNum: 1 });
    });
    it('3 correct number and 2 correct location', () => {
        expect(_scoreCorrectNums(secretCode, guess4)).to.deep.equal({numCorrectLoc: 2, numCorrectNum: 3 });
    });
});
