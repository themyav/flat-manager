// App.js
import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './pages/StartPage.tsx';
import HomePage from './pages/HomePage.tsx';
import FlatForm from './pages/FlatForm.tsx';
import FlatPage from './pages/FlatPage.tsx';
import UtilityForm from './pages/UtilityForm.tsx';
import UtilityPage from './pages/UtilityPage.tsx';
import UserPage from './pages/UserPage.tsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<StartPage />} />
                    <Route path="/login" element={<StartPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/add-flat" element={<FlatForm />} />
                    <Route path="/flat/:id" element={<FlatPage />} />
                    <Route path="/add-utility/:id" element={<UtilityForm />} />
                    <Route path="/utility/:id" element={<UtilityPage />} />
                    <Route path="/user/:id" element={<UserPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;