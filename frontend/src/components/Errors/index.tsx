import React, { SetStateAction } from "react";
import "./errors.css";

interface Props {
    errors: string[];
}

const Errors: React.FC<Props> = ({ errors }) => {
    return (
        <>
            {
                errors && !!errors.length &&
                <ul id="errors" className="flex-col">
                    {errors.map((error: string, idx: number) => <li> {error} </li>)}
                </ul>
            }
        </>
    );
};

export default Errors;