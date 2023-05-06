import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import GameRoom from './pages/game-room/game-room';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={
            <GameRoom />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;