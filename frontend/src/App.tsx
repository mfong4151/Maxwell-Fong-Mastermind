import React from 'react';
import Layout from './layouts/Layout';
import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom';
import Game from './pages/Game';
import Games from './pages/Games';
import NewGame from './components/NewGameForm';
import { GameProvider } from './context/GameContext';
import LoginPage from './pages/Login';

const App: React.FC = () => {

    return (
      <GameProvider>
          <Router>
            <Layout>
            <Routes>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/games' element={<Games/>} />
              <Route path='/game/new' element={<NewGame />} />
              <Route path='/game/:id' element={<Game />} />
              <Route path='/' element={<LoginPage/>}/>
            </Routes>
            </Layout>
          </Router>
      </GameProvider>
    )

}

export default App;
