import React from 'react';
import { StateSetter } from '../types';

interface Props{
    endsAt: number | null
    setEndsAt: StateSetter<number | null>
}
const EndsAtSelect:React.FC<Props> = ({endsAt, setEndsAt}) => {

    const handleSelect = (e:any):void => {
        
        const MILIS = 1000
        const SECS = 60
        
        if (e.target.value === 'null'){
            setEndsAt(null)
            return
        }
        
        setEndsAt(parseInt(e.target.value, 10) * SECS * MILIS)

    }

    return (
    <select onChange={handleSelect}>
        <option value="null">None</option>
        <option value="5">5 mins</option>
        <option value="30">30 mins</option>
        <option value="60">1 hr</option>
        <option value="1440">1 day</option>
    </select>
    );
};

export default EndsAtSelect;