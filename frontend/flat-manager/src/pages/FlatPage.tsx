import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { updateFlat, getFlatUtilities } from './api.ts';

function FlatPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [flat, setFlat] = useState(location.state?.flat || null);
    const [utilities, setUtilities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFlat, setEditedFlat] = useState({
        name: flat?.name || '',
        address: flat?.address || ''
    });

    const fetchUtilities = useCallback(async () => {
        if (!id) return;

        try {
            const response = await getFlatUtilities(id);
            setUtilities(response.data);
        } catch (error) {
            console.error('Error fetching utilities:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchUtilities();
    }, [fetchUtilities]);

    // Update editedFlat when flat changes
    useEffect(() => {
        if (flat) {
            setEditedFlat({
                name: flat.name,
                address: flat.address
            });
        }
    }, [flat]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!flat?.id) return;

        try {
            const updatedFlat = {
                ...flat,
                name: editedFlat.name,
                address: editedFlat.address
            };
            await updateFlat(flat.id, updatedFlat);
            setFlat(updatedFlat);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating flat:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedFlat(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (!flat) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Информация о квартире</h1>

            {isEditing ? (
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        label="Название"
                        name="name"
                        value={editedFlat.name}
                        onChange={handleChange}
                        fullWidth
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Адрес"
                        name="address"
                        value={editedFlat.address}
                        onChange={handleChange}
                        fullWidth
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
                    <h2>Название: {flat.name}</h2>
                    <h3>Адрес: {flat.address}</h3>
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

            <h2>Коммунальные платежи</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Цена</TableCell>
                            <TableCell>Дата</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {utilities.map((utility) => (
                            <TableRow key={utility.id}>
                                <TableCell>{utility.id}</TableCell>
                                <TableCell>{utility.name}</TableCell>
                                <TableCell>{utility.price}</TableCell>
                                <TableCell>{formatDate(utility.date)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/home')}
                style={{ marginTop: '20px' }}
            >
                Назад
            </Button>
        </div>
    );
}

export default FlatPage;