import React, { ReactNode } from 'react';
import './modallayout.css';

interface Props{
    children: ReactNode
}

const ModalLayout:React.FC<Props> = ({children}) => {


  return (
    <div className='modal-overlay flex-center'>
        {children}
    </div>
  );
};

export default ModalLayout;