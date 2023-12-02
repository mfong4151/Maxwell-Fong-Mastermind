import React from 'react';
import Layout from './layouts/Layout';
import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom';
import Game from './pages/Game';
import NewGame from './pages/NewGame';
import { GameProvider } from './context/GameContext';

const App: React.FC = () => {

  return (
    <GameProvider>
      <Layout>
        <Router>
          <Routes>
            <Route path='/games' element={<></>} />
            <Route path='/game/new' element={<NewGame />} />
            <Route path='/game/:id' element={<Game />} />
          </Routes>
        </Router>
      </Layout>
    </GameProvider>
  )

}

export default App;
