import * as React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {Button, TextField, Typography} from '@mui/material';
import {getUserById, updateUserById} from '../api.ts'; // Adjust path as needed

function UserPage() {
    const {id} = useParams();
    const userId = parseInt(id, 10);
    const navigate = useNavigate();

    const location = useLocation();
    const [user, setUser] = useState(location.state?.user);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [editedUser, setEditedUser] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        oldPassword: '',
        newPassword: '',
    });

    const fetchUserData = useCallback(async () => {
        try {
            const response = await getUserById(userId);
            if (response && response.data) {
                setUser(response.data);
                setEditedUser({
                    username: response.data.username || '',
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    phoneNumber: response.data.phoneNumber || '',
                    oldPassword: '',
                    newPassword: '',
                });
            } else {
                console.warn("Пользователь не найден");
                setUser(null);
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователя:', error);
            setUser(null);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleEdit = () => {
        setIsEditing(true);
        setError('');
    };

    const handleSave = async () => {
        setError('');

        const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
        if (editedUser.phoneNumber && !phoneRegex.test(editedUser.phoneNumber)) {
            setError('Неверный формат номера телефона. Используйте формат: +7 XXX XXX XX XX');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (editedUser.email && !emailRegex.test(editedUser.email)) {
            setError('Неверный формат email.');
            return;
        }

        if (editedUser.oldPassword && !editedUser.newPassword) {
            setError("Введите новый пароль");
            return;
        }

        if (!editedUser.oldPassword && editedUser.newPassword) {
            setError("Введите старый пароль");
            return;
        }

        if (editedUser.oldPassword !== "" || editedUser.newPassword !== "") {
            if (editedUser.oldPassword !== user.password) {
                setError("Старый пароль не совпадает с паролем пользователя");
                return;
            }
            if (editedUser.oldPassword === editedUser.newPassword) {
                setError("Новый пароль совпадает со старым паролем пользователя");
                return;
            }
        }

        try {
            const updatedUser = {
                id: user.id,
                username: editedUser.username,
                firstName: editedUser.firstName,
                lastName: editedUser.lastName,
                email: editedUser.email,
                phoneNumber: editedUser.phoneNumber,
                oldPassword: editedUser.oldPassword,
                newPassword: editedUser.newPassword,
                password: editedUser.newPassword === '' ? user.password : editedUser.newPassword
            };

            const response = await updateUserById(user.id, updatedUser);

            if (response.data && response.data.error) {
                setError(response.data.error);
            } else if (response && response.data) {
                setUser(response.data);
                location.state.user = response.data
                setIsEditing(false);
                setEditedUser(prev => ({...prev, oldPassword: '', newPassword: ''}));
            } else {
                setError('Неизвестная ошибка при обновлении данных');
            }
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            setError('Ошибка при обновлении пользователя');
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
            setEditedUser({...editedUser, [name]: formattedPhone.substring(0, 16)});
        } else {
            setEditedUser({...editedUser, [name]: value});
        }
    };

    if (!user) {
        return <div>Загрузка... или Пользователь не найден</div>;
    }

    return (
        <div style={{padding: '20px'}}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>Назад</Button>
            <h1>Информация о пользователе</h1>

            {error && <Typography color="error">{error}</Typography>}

            {isEditing ? (
                <div>
                    <TextField label="Имя пользователя" name="username" value={editedUser.username}
                               onChange={handleChange}
                               fullWidth style={{marginBottom: '10px'}}/>
                    <TextField label="Имя" name="firstName" value={editedUser.firstName} onChange={handleChange}
                               fullWidth style={{marginBottom: '10px'}}/>
                    <TextField label="Фамилия" name="lastName" value={editedUser.lastName} onChange={handleChange}
                               fullWidth style={{marginBottom: '10px'}}/>
                    <TextField label="Email" name="email" type={"email"} value={editedUser.email}
                               onChange={handleChange} fullWidth
                               style={{marginBottom: '10px'}}/>
                    <TextField label="Номер телефона" name="phoneNumber" value={editedUser.phoneNumber}
                               onChange={handleChange} fullWidth style={{marginBottom: '10px'}}
                               placeholder="+7 XXX XXX XX XX"/>
                    <TextField label="Старый пароль" name="oldPassword" type="password" value={editedUser.oldPassword}
                               onChange={handleChange} fullWidth style={{marginBottom: '10px'}}/>
                    <TextField label="Новый пароль" name="newPassword" type="password" value={editedUser.newPassword}
                               onChange={handleChange} fullWidth style={{marginBottom: '10px'}}/>
                    <Button variant="contained" color="primary" onClick={handleSave}
                            style={{marginRight: '10px'}}>Сохранить</Button>
                    <Button variant="contained" color="secondary" onClick={() => {
                        setIsEditing(false);
                        setError('');
                        setEditedUser(prev => ({...prev, oldPassword: '', newPassword: ''}));
                    }}>Отмена</Button>
                </div>
            ) : (
                <div>
                    <p><b>Имя пользователя:</b> {user.username || ''}</p>
                    <p><b>Имя:</b> {user.firstName || ''}</p>
                    <p><b>Фамилия:</b> {user.lastName || ''}</p>
                    <p><b>Email:</b> {user.email || ''}</p>
                    <p><b>Номер телефона:</b> {user.phoneNumber || ''}</p>
                    <Button variant="contained" color="primary" onClick={handleEdit}>Редактировать</Button>
                </div>
            )}
        </div>
    );
}

export default UserPage;