import React, { useState } from 'react';
import { SERVER_URL } from '../../utils';
import { useParams } from 'react-router-dom';
import Errors from '../../components/Errors';
import { useErrors } from '../../hooks';


const Hints:React.FC = () => {
    const {id} = useParams()
    const {errors, setErrors, useClearErrorsEffect} = useErrors();
    const [hints, setHints] = useState<string>('')

    useClearErrorsEffect(hints)

    const handleOnClick = async (e:any): Promise<void> => {
        e.preventDefault()
        e.stopPropagation()

        try {
            const res = await fetch(`${SERVER_URL}/api/v1/games/${id}/hints`);
            const data = await res.json();
            
            if (res.ok){
                setHints(data.hint)        
            }
            
            setErrors(data.errors)
        } catch (error: any) {
            setErrors(["Issue accessing server"])
        }
    }

  return (
    <div>
        <h3>Get Hints!</h3>
        <button onClick={handleOnClick}>
            Hints please!
        </button>
        {hints && <p>{hints}</p>}
        <Errors errors={errors} />

    </div>
  );
};

export default Hints;