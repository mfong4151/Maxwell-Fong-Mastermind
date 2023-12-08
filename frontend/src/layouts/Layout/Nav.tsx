import React, {FC} from "react";
import "./layout.css"
import { Link } from "react-router-dom";

const Nav:React.FC = () => {
  return (
    <nav id="navbar" className="align-center">
      <ul className="flex-row flex-evenly">
        <li>
          <Link to="/games">
            Your Games
          </Link>
        </li>
        
      </ul>
    </nav>
  );
};

export default Nav;