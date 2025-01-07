import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { addFlat } from './api.ts';
import { useState } from "react";

function FlatForm() {
    const [flatData, setFlatData] = useState({
        name: '',
        address: '',
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addFlat(flatData);
            navigate('/home');
        } catch (error) {
            console.error('Error adding flat:', error);
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
        <form onSubmit={handleSubmit}>
            <TextField
                label="Название"
                variant="outlined"
                fullWidth
                name="name"
                value={flatData.name}
                onChange={handleChange}
                required
            />
            <TextField
                label="Адрес"
                variant="outlined"
                fullWidth
                name="address"
                value={flatData.address}
                onChange={handleChange}
                required
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
                Добавить
            </Button>
            <Button variant="contained" color="secondary" onClick={handleBack}>
                Назад
            </Button>
        </form>
    );
}

export default FlatForm;