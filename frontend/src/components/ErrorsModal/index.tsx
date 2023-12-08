import React, { ReactNode } from "react";
import ModalLayout from "../../layouts/ModalLayout";
import { ErrorsOptions, StateSetter } from "../../types";
import Errors from "../Errors";
import { createPortal } from "react-dom";
import "./errorsmodal.css";

interface Props {
    errors: string[]
    setErrors: StateSetter<string[]>
}
const ErrorsModal: React.FC<Props> = ({ errors, setErrors }) => {
    
    const handleOnClick = (e:any):void => {
        e.preventDefault()
        e.stopPropagation()
        setErrors([])   
    }

    return (
        <>
        { errors && !!errors.length && createPortal(
            <ModalLayout>
                <dialog open id="errors-modal" onClick={e => e.stopPropagation()}>
                    <div className="flex-center-right">
                        <button onClick={handleOnClick}>Exit</button>
                    </div>
                    <Errors errors={errors} />
                </dialog>
            </ModalLayout>,
            document.body
        )}
    </>
    );
};

export default ErrorsModal;