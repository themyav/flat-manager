// App.js
import './App.css';
import * as React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import StartPage from './pages/StartPage.tsx';
import HomePage from './pages/user/HomePage.tsx';
import FlatForm from './pages/flat/FlatForm.tsx';
import FlatPage from './pages/flat/FlatPage.tsx';
import UtilityForm from './pages/utility/UtilityForm.tsx';
import UtilityPage from './pages/utility/UtilityPage.tsx';
import UserPage from './pages/user/UserPage.tsx';
import StatsPage from "./pages/stats/StatsPage.tsx";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<StartPage/>}/>
                    <Route path="/login" element={<StartPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/add-flat" element={<FlatForm/>}/>
                    <Route path="/flat/:id" element={<FlatPage/>}/>
                    <Route path="/add-utility/:id" element={<UtilityForm/>}/>
                    <Route path="/utility/:id" element={<UtilityPage/>}/>
                    <Route path="/user/:id" element={<UserPage/>}/>
                    <Route path="/flat/:id/stats" element={<StatsPage/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;