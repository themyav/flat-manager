import * as React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useState} from "react";
import { registerUser } from './api.ts'; // Import the registerUser function

function SignupForm() {
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true); // Set loading to true before the request

        const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
        if (!phoneRegex.test(signupData.phone)) {
            setError('Неверный формат номера телефона. Используйте формат: +7 XXX XXX XX XX');
            setLoading(false); // Set loading to false if validation fails
            return;
        }

        if (signupData.password !== signupData.confirmPassword) {
            setError('Пароли не совпадают');
            setLoading(false); // Set loading to false if validation fails
            return;
        }

        try {
            const response = await registerUser(signupData); // Use the imported function
            if (response.status === 200) {
                setSuccessMessage('Регистрация прошла успешно!');
                setSignupData({
                    username: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    password: '',
                    confirmPassword: '',
                    phone: ''
                });
            }
        } catch (error) {
            setError('Ошибка регистрации. Попробуйте снова.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false); // Set loading to false after the request completes (success or error)
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "phone") {
            let formattedPhone = value;
            formattedPhone = formattedPhone.replace(/\D/g, '');
            if (formattedPhone.startsWith("7")) {
                formattedPhone = formattedPhone.substring(1);
            }
            if (formattedPhone.length > 0) {
                formattedPhone = `+7 ${formattedPhone.substring(0, 3)}${formattedPhone.length > 3 ? ` ${formattedPhone.substring(3, 6)}` : ''}${formattedPhone.length > 6 ? ` ${formattedPhone.substring(6, 8)}` : ''}${formattedPhone.length > 8 ? ` ${formattedPhone.substring(8, 10)}` : ''}`.trim();
            } else {
                formattedPhone = "";
            }
            setSignupData({...signupData, [name]: formattedPhone.substring(0, 16)});
        } else {
            setSignupData({...signupData, [name]: value});
        }
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        paddingBottom: '5px',
        maxWidth: '400px',
        margin: '0px auto'
    };

    const passwordFieldsMargin = {
        margin: '10px 0'
    };

    const passwordFieldsMargin2 = {
        margin: '10px 0'
    };


    return (
        <form onSubmit={handleSignup} style={formStyle}>
            {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}
            {successMessage &&
                <div style={{color: 'green', textAlign: 'center', marginBottom: '10px'}}>{successMessage}</div>}
            {loading &&  // Conditionally render based on boolean loading state
                <div style={{color: 'gray', textAlign: 'center', marginBottom: '10px'}}>Подождите...</div>}
            <TextField
                label="Логин"
                variant="outlined"
                fullWidth
                name="username"
                value={signupData.username}
                onChange={handleChange}
                required
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={signupData.email}
                onChange={handleChange}
                required
            />
            <TextField
                label="Номер телефона"
                variant="outlined"
                fullWidth
                name="phone"
                value={signupData.phone}
                onChange={handleChange}
                required
                placeholder="+7 XXX XXX XX XX"
            />
            <div style={passwordFieldsMargin2}/>
            <TextField
                label="Имя"
                variant="outlined"
                fullWidth
                name="firstName"
                value={signupData.firstName}
                onChange={handleChange}
            />
            <TextField
                label="Фамилия"
                variant="outlined"
                fullWidth
                name="lastName"
                value={signupData.lastName}
                onChange={handleChange}
            />

            <div style={passwordFieldsMargin}/>
            <TextField
                label="Пароль"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={signupData.password}
                onChange={handleChange}
                required
            />
            <TextField
                label="Повторите пароль"
                variant="outlined"
                fullWidth
                name="confirmPassword"
                type="password"
                value={signupData.confirmPassword}
                onChange={handleChange}
                required
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}
                    style={{ marginBottom: '0px' }}
            >
                Зарегистрироваться
            </Button>
        </form>
    );
}

export default SignupForm;