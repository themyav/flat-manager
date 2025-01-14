import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, TextField} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
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
        date: null,
        paymentUrl: ''
    });
    const [flatId] = useState(localStorage.getItem('flatId'));

    const fetchUtility = useCallback(async () => {
        if (!id) return;

        try {
            const response = await getUtility(id);
            setUtility(response.data);
            const date = dayjs(response.data.date);
            setEditedUtility({
                name: response.data.name,
                price: response.data.price.toString(),
                date: date,
                paymentUrl: response.data.paymentUrl || ''
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
            const date = dayjs(utility.date);
            setEditedUtility({
                name: utility.name,
                price: utility.price.toString(),
                date: date,
                paymentUrl: utility.paymentUrl || ''
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
                id: utility.id,
                name: editedUtility.name,
                price: parseFloat(editedUtility.price),
                date: editedUtility.date.toISOString(),
                paymentUrl: editedUtility.paymentUrl,
                flatId: utility.flat.id
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

    const handleDateChange = (newDate) => {
        setEditedUtility({ ...editedUtility, date: newDate });
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

    const formatDateDayOnly = (dateString) => {
        return dayjs(dateString).format('DD');
    };

    if (!utility) {
        return <div>Loading...</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="ru">
            <div style={{ padding: '20px' }}>
                <h1>Информация о коммунальном платеже</h1>

                {isEditing ? (
                    <form>
                        <TextField
                            label="Название"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={editedUtility.name}
                            onChange={handleChange}
                            required
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="Цена"
                            variant="outlined"
                            fullWidth
                            name="price"
                            value={editedUtility.price}
                            onChange={handleChange}
                            required
                            type="number"
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="URL для оплаты"
                            variant="outlined"
                            fullWidth
                            name="paymentUrl"
                            value={editedUtility.paymentUrl}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                        <DatePicker
                            label="Максимальный день для подачи показаний"
                            value={editedUtility.date}
                            onChange={handleDateChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    required
                                    helperText="Выберите последний день для подачи показаний в текущем месяце"
                                    style={{ marginBottom: '20px' }}
                                />
                            )}
                            views={['day']}
                            mask="__.__.____"
                            inputFormat="DD.MM.YYYY"
                            disableFuture
                        />
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                type="button"
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
                    </form>
                ) : (
                    <div style={{ marginBottom: '20px' }}>
                        <h2>Название: {utility.name}</h2>
                        <h3>Цена: {utility.price}</h3>
                        <h3>Подать показания до: {formatDateDayOnly(utility.date)} числа каждого месяца</h3>
                        <h3>
                            Ссылка на оплату:
                            {utility.paymentUrl ? (
                                <a href={utility.paymentUrl} target="_blank" rel="noopener noreferrer">
                                    Перейти по ссылке
                                </a>
                            ) : (
                                ' Отсутствует'
                            )}
                        </h3>
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
        </LocalizationProvider>
    );
}

export default UtilityPage;