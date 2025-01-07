import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useNavigate, useParams} from 'react-router-dom';
import {addUtility} from './api.ts';
import {useState} from 'react';

function UtilityForm() {
    const {id: flatIdFromParams} = useParams(); // Get flatId from URL
    const flatId = flatIdFromParams || localStorage.getItem('flatId'); // Fallback to localStorage
    const navigate = useNavigate();

    const [utilityData, setUtilityData] = useState({
        name: '',
        price: '',
        date: '',
        flat: {id: parseInt(flatId)}
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setMessageType(null);
        setLoading(true);

        const formattedUtilityData = {
            ...utilityData,
            price: parseFloat(utilityData.price),
            date: new Date(utilityData.date).toISOString()
        };

        try {
            await addUtility(formattedUtilityData);
            setMessage('Коммунальный платеж успешно добавлен!');
            setMessageType('success');
        } catch (error) {
            setMessage('Ошибка при добавлении коммунального платежа.');
            setMessageType('error');
            console.error('Error adding utility:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUtilityData({...utilityData, [name]: value});
    };

    const handleBack = () => {
        navigate(`/flat/${flatId}`);
    };

    return (
        <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
            <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Добавление коммунального платежа</h2>
            {loading && <div style={{color: 'gray', textAlign: 'center', marginBottom: '10px'}}>Загрузка...</div>}
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
                    value={utilityData.name}
                    onChange={handleChange}
                    required
                    style={{marginBottom: '20px'}}
                />
                <TextField
                    label="Цена"
                    variant="outlined"
                    fullWidth
                    name="price"
                    value={utilityData.price}
                    onChange={handleChange}
                    required
                    type="number" // Use type="number" for price
                    style={{marginBottom: '20px'}}
                />
                <TextField
                    label="Дата"
                    variant="outlined"
                    fullWidth
                    name="date"
                    value={utilityData.date}
                    onChange={handleChange}
                    required
                    type="date" // Use type="date" for date input
                    style={{marginBottom: '20px'}}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}
                        style={{marginRight: '10px'}}>
                    Добавить
                </Button>
                <Button variant="contained" color="secondary" onClick={handleBack} disabled={loading}>
                    Назад
                </Button>
            </form>
        </div>
    );
}

export default UtilityForm;