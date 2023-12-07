import React from 'react';
import Login from './Login';
import LoginlessPlay from './LoginlessPlay';

interface Props{

}
const LoginPage:React.FC<Props> = () => {


  return (
    <div className='flex-center flex-col'>
        <Login/>
        <LoginlessPlay/>
    </div>
  );
};

export default LoginPage;