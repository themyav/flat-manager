import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {registerUser} from '../api.ts';

function SignupForm() {
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (signupData.email && !emailRegex.test(signupData.email)) {
            setError('Неверный формат email.');
            setLoading(false);
            return;
        }


        const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
        if (!phoneRegex.test(signupData.phoneNumber)) {
            setError('Неверный формат номера телефона. Используйте формат: +7 XXX XXX XX XX');
            setLoading(false);
            return;
        }

        if (signupData.password !== signupData.confirmPassword) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        if (signupData.password.length < 8) {
            setError('Пароль должен содержать не менее 8 символов');
            setLoading(false);
            return;
        }

        if (!/\d/.test(signupData.password)) {
            setError('Пароль должен содержать хотя бы одну цифру');
            setLoading(false);
            return;
        }

        if (!/[a-zA-Z]/.test(signupData.password)) {
            setError('Пароль должен содержать хотя бы одну букву');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(signupData);
            if (response.status === 201) {
                setSuccessMessage('Регистрация прошла успешно!');
            }
        } catch (error) {
            setError('Ошибка регистрации: ' + error.response.data.toString() + '.\nПопробуйте снова.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "phoneNumber") {
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
        <>
            {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}
            {loading &&
                <div style={{color: 'gray', textAlign: 'center', marginBottom: '10px'}}>Подождите...</div>}
            {successMessage && (
                <div style={{color: 'green', textAlign: 'center', marginTop: '10px'}}>
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSignup} style={formStyle}>

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
                    name="phoneNumber"
                    value={signupData.phoneNumber}
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
                    helperText={error && (error.startsWith('Пароль') ? error : '')}
                    error={error && (error.startsWith('Пароль'))}
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
                    helperText={error && (error === 'Пароли не совпадают' ? error : '')}
                    error={error && (error === 'Пароли не совпадают')}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}
                        style={{marginBottom: '0px'}}
                >
                    Зарегистрироваться
                </Button>
            </form>
        </>
    );
}

export default SignupForm;