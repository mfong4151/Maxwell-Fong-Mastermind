import React, {SetStateAction} from "react";

export type StateSetter<T> = React.Dispatch<SetStateAction<T>>