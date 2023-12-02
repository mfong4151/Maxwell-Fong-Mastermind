import React, { SetStateAction } from 'react';
import { StateSetter } from '../../types';

interface Props {
    errors: string[];
}

const Errors: React.FC<Props> = ({ errors }) => {

    return (
        <>
            {
                !!errors.length &&
                <ul>
                    {errors.map((error: string, idx: number) => <li> {error} </li>)}
                </ul>
            }
        </>
    );
};

export default Errors;