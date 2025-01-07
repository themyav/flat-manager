import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { addFlat } from './api.ts';
import { useState, useEffect } from 'react';

function FlatForm() {
    const [flatData, setFlatData] = useState({
        name: '',
        address: '',
        user: null
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setFlatData(prev => ({
                ...prev,
                user: { id: storedUser.id }
            }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setMessageType(null);
        setLoading(true);

        try {
            await addFlat(flatData);
            setMessage('Квартира успешно добавлена!');
            setMessageType('success');
        } catch (error) {
            setMessage('Ошибка при добавлении квартиры.');
            setMessageType('error');
            console.error('Error adding flat:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlatData({ ...flatData, [name]: value });
    };

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Добавление квартиры</h2>
            {loading && <div style={{ color: 'gray', textAlign: 'center', marginBottom: '10px' }}>Загрузка...</div>}
            {message && (
                <div
                    style={{
                        color: messageType === 'success' ? 'green' : 'red',
                        textAlign: 'center',
                        marginBottom: '10px'
                    }}
                >
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Название"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={flatData.name}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Адрес"
                    variant="outlined"
                    fullWidth
                    name="address"
                    value={flatData.address}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '20px' }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading} style={{ marginRight: '10px' }}>
                    Добавить
                </Button>
                <Button variant="contained" color="secondary" onClick={handleBack} disabled={loading}>
                    Назад
                </Button>
            </form>
        </div>
    );
}

export default FlatForm;