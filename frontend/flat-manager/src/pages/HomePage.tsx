import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = () => {
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            <h1>Добро пожаловать на домашнюю страницу</h1>
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Выйти
            </Button>
        </div>
    );
}

export default HomePage;