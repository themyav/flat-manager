import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { updateUtility, getUtility } from './api.ts';

function UtilityPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [utility, setUtility] = useState(location.state?.utility);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUtility, setEditedUtility] = useState({
        name: '',
        price: '',
        date: ''
    });
    const [flatId] = useState(localStorage.getItem('flatId'));

    const fetchUtility = useCallback(async () => {
        if (!id) return;

        try {
            const response = await getUtility(id);
            setUtility(response.data);
            const date = new Date(response.data.date);
            const formattedDate = date.toISOString().split('T')[0];
            setEditedUtility({
                name: response.data.name,
                price: response.data.price,
                date: formattedDate
            });
        } catch (error) {
            console.error('Error fetching utility details:', error);
        }
    }, [id]);

    useEffect(() => {
        if (!utility) {
            fetchUtility();
        }
    }, [fetchUtility, utility]);

    useEffect(() => {
        if (utility) {
            const date = new Date(utility.date);
            const formattedDate = date.toISOString().split('T')[0];
            setEditedUtility({
                name: utility.name,
                price: utility.price,
                date: formattedDate
            });
        }
    }, [utility]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!utility?.id) return;

        try {
            const updatedUtility = {
                ...utility,
                name: editedUtility.name,
                price: parseFloat(editedUtility.price),
                date: new Date(editedUtility.date).toISOString()
            };

            await updateUtility(utility.id, updatedUtility);
            setUtility(updatedUtility);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating utility:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUtility(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBack = () => {
        if (flatId) {
            navigate(`/flat/${flatId}`, {
                state: { needRefresh: true }
            });
        } else {
            navigate('/home');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (!utility) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Информация о коммунальном платеже</h1>

            {isEditing ? (
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        label="Название"
                        name="name"
                        value={editedUtility.name}
                        onChange={handleChange}
                        fullWidth
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Цена"
                        name="price"
                        value={editedUtility.price}
                        onChange={handleChange}
                        fullWidth
                        type="number"
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Дата"
                        name="date"
                        value={editedUtility.date}
                        onChange={handleChange}
                        fullWidth
                        type="date"
                        style={{ marginBottom: '10px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        style={{ marginRight: '10px' }}
                    >
                        Сохранить
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsEditing(false)}
                    >
                        Отмена
                    </Button>
                </div>
            ) : (
                <div style={{ marginBottom: '20px' }}>
                    <h2>Название: {utility.name}</h2>
                    <h3>Цена: {utility.price}</h3>
                    <h3>Дата: {formatDate(utility.date)}</h3>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEdit}
                        style={{ marginBottom: '20px' }}
                    >
                        Редактировать
                    </Button>
                </div>
            )}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleBack}
                style={{ marginTop: '20px' }}
            >
                Назад
            </Button>
        </div>
    );
}

export default UtilityPage;