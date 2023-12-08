import React, {useState} from "react";
import { SERVER_URL, jwtFetch } from "../../utils";
import ErrorsModal from "../../components/ErrorsModal";


const MultiplayerInvite: React.FC = () => {
    const [playerId, setPlayerId] = useState<number>(0);
    const [gameId, setGameId] = useState<number>(0);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<string>('')

    const handleOnClick = async (e:any):Promise<void> => {
        e.preventDefault()
        e.stopPropagation()
        const body = {
            playerId,
        }
        
        try {
            const res = await jwtFetch(`${SERVER_URL}/api/v1/games/${gameId}/players`, body, "POST");
            const data = await res.json();
            
            if (res.ok){
                setSuccess(`Succesfully added player ${data.playerId} to game ${data.gameId}`)
            }
            
            setErrors(data.errors)
        } catch (error: any) {
            setErrors(['Issue connecting to server'])
        }


    }

    return (
        <div id="" className="">
            <h3>Add a Player to Your Game</h3>
            <form onSubmit={handleOnClick}>
                <div>
                    <label htmlFor="playerId">
                        PlayerId:
                    </label>
                    <input type="number" onChange={e => setPlayerId(Number(e.target.value))}/>
                </div>
                <div>
                   <label htmlFor="gameId">
                         GameId:
                    </label>
                    <input type="number" onChange={e => setGameId(Number(e.target.value))} />
                </div>
                <button>
                    Add to game
                </button>

            </form>
            {success &&  <p>{success} </p>}
            <ErrorsModal errors={errors} setErrors={setErrors}/>
        </div>
    );
};

export default MultiplayerInvite;