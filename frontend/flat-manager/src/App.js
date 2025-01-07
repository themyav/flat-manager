import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './pages/StartPage.tsx';
import HomePage from './pages/HomePage.tsx'; // Import the new HomePage component

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<StartPage />} />
                    <Route path="/login" element={<StartPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;