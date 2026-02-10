// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Creator from './Creator';
import CardViewer from './CardViewer';

function App() {
  return (
    <Router>
      <Routes>
        {/* The Home Page where people make the card */}
        <Route path="/" element={<Creator />} />
        
        {/* The Card Page where recipients view the card */}
        {/* :id is a variable that will catch whatever ID is in the URL */}
        <Route path="/card/:id" element={<CardViewer />} />
      </Routes>
    </Router>
  );
}

export default App;