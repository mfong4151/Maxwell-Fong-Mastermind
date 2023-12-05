import React, {SetStateAction} from "react";

export type StateSetter<T> = React.Dispatch<SetStateAction<T>>

export interface ErrorsProps{
    errors: string[];
    setErrors: StateSetter<string[]>
}