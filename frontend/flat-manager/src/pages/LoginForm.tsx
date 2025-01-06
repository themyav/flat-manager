// LoginForm.tsx
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useState} from "react";
import {loginUser} from './api.ts'; // Import loginUser

function LoginForm() {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState(''); // Add error state
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true); // Set loading to true before the request

        try {
            const response = await loginUser(loginData); // Use the imported function
            if (response.status === 200) {
                console.log('Login successful!');
                // You might want to redirect the user here or update the app state
            }
            //No need for else, as error is handled in catch
        } catch (error) {
            setError('Неверные логин или пароль'); // Set error message
            console.error("Login Error:", error);

        } finally {
            setLoading(false); // Set loading to false after the request completes (success or error)
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setLoginData({...loginData, [name]: value});
    };

    return (
        <form onSubmit={handleLogin}>
            {error && <div
                style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>} {/* Display error */}
            {loading &&  // Conditionally render based on boolean loading state
                <div style={{color: 'gray', textAlign: 'center', marginBottom: '10px'}}>Подождите...</div>}
            <TextField
                label="Логин"
                variant="outlined"
                fullWidth
                name="username"
                value={loginData.username}
                onChange={handleChange}
                required
            />
            <TextField
                label="Пароль"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                required
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                Войти
            </Button>
        </form>
    );
}

export default LoginForm;