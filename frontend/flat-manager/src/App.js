import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './pages/StartPage.tsx';
import HomePage from './pages/HomePage.tsx';
import FlatForm from './pages/FlatForm.tsx'; // Import the new FlatForm component

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<StartPage />} />
                    <Route path="/login" element={<StartPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/add-flat" element={<FlatForm />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;