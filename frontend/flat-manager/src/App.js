import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './pages/StartPage.tsx';
import HomePage from './pages/HomePage.tsx';
import FlatForm from './pages/FlatForm.tsx';
import FlatPage from './pages/FlatPage.tsx'; // Import the new FlatPage component

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<StartPage />} />
                    <Route path="/login" element={<StartPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/add-flat" element={<FlatForm />} />
                    <Route path="/flat/:id" element={<FlatPage />} /> {/* Add this route for FlatPage */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;