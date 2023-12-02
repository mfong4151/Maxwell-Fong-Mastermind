import React from 'react';
import { isLoggedIn, logout } from '../../utils';
import { useNavigate } from 'react-router-dom';

interface Props{

}
const Header:React.FC<Props> = () => {
  const navigate = useNavigate()

  const handleOnClick = (e:any):void => {
    const id  = e.target.id;
    
    if (id === 'login'){
      navigate('/login')      
    }else{
      logout()
      navigate('/login')
    }
  }

  return (
    <header className='padding-default flex-between'>
      <span>
        Mastermind
      </span>

      <div>
        { 
          isLoggedIn() 
          ?
            <button id='logout' onClick={handleOnClick}>
              Log out
            </button>
          :
            <button id='login' onClick={handleOnClick}>
               Log in 
            </button>
        }

      </div>
    </header>
  );
};

export default Header;