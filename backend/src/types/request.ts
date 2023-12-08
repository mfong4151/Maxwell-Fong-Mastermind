//Request type of the gamePost bbody

export interface GameOptions{
    num: number;
    min?: string;
    max?: string;
    col?: string;
    base?: string;
    format?: string;
    rnd?: string;
    playerIds?: number[];
};