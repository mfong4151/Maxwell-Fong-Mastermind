import axios from "axios";
import {  GameOptions} from "../../../types/request"

//Default settings as requested in instructions
const MIN: number = 0;
const MAX: number=  7;
const COL: number = 1;
const BASE: number = 10;
const FORMAT : string = "plain"
const RND: string = "new" 

//Logic for grabbing a random code, returns an empty array if there is an error (you can"t guess what doesn"t exist!)
export const _generateRandomCode = async (codeOptions: GameOptions): Promise<string[]> =>{
    const randomCodeUrl: string =  _generateRandomOrgUrl(codeOptions);

    try {
        const res: any = await axios.get(randomCodeUrl)
        if (res.data){
            return _transposeRandomText(res.data)
        }
        return []

    } catch (error) {
        return []           
    }
    
}

//Left extensible in case of variable query args
const _generateRandomOrgUrl = ({num} :GameOptions ): string => (
    `https://www.random.org/integers/?num=${num}&min=${MIN}&max=${MAX}&col=${COL}&base=${BASE}&format=${FORMAT}&rnd=${RND}`
)

const _transposeRandomText= (randomNumberStr: string): string[] => (
    randomNumberStr
        .split("\n")
        .filter((num: string) => num !== "")
)  


