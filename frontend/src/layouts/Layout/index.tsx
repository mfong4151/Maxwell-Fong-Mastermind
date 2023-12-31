import React, { ReactNode } from "react";
import Header from "./Header";
import Nav from "./Nav";
import "./layout.css"

interface Props{
    children: ReactNode
}
const Layout:React.FC<Props> = ({children}) => {

  return (
    <>
        <Header/>
        <Nav/>
        <main>
            {children}
        </main>
    </>
    );
};

export default Layout;