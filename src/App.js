import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import GameRoom from './pages/game-room/game-room';
import Home from './pages/home/home';

function App() {
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    const newSocket = io('http://localhost:4000')
    setSocket(newSocket)
    return socket ? socket.disconnect() : null;
  }, [])

  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={
            <Home 
              username={username}
              setUsername={setUsername}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          } />
          <Route path='/game-room' element={
            <GameRoom username={username} room={room} socket={socket}/>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;