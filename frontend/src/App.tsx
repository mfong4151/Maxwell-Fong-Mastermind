import React from 'react';
import Layout from './layouts/Layout';
import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom';
import Game from './pages/Game';
import Games from './pages/Games';
import NewGame from './pages/NewGame';
import Login from './pages/Login';
import { GameProvider } from './context/GameContext';

const App: React.FC = () => {

  return (
    <GameProvider>
        <Router>
          <Layout>
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/games' element={<Games/>} />
            <Route path='/game/new' element={<NewGame />} />
            <Route path='/game/:id' element={<Game />} />
            <Route path='/' element={<Login/>}/>
          </Routes>
          </Layout>
        </Router>
    </GameProvider>
  )

}

export default App;
