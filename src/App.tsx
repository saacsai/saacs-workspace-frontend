import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TokenValidation } from './pages/TokenValidation';
import { Setup } from './pages/Setup';
import { Chat } from './pages/Chat';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TokenValidation />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
