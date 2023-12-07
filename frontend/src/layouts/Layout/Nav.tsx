import React, {FC} from 'react';
import './layout.css'
import { Link } from 'react-router-dom';

const Nav:React.FC = () => {
  return (
    <nav id='navbar' className='align-center'>
      <ul className='flex-row flex-evenly'>
        <li>
          <Link to='/games'>
            Home
          </Link>
        </li>
        <li>
          <Link to='/invites'>
            Invites
          </Link>
        </li>
        <li>
          <Link to='/leader-board'>
            Leader Board
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;