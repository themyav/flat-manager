import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useNavigate, useParams} from 'react-router-dom';
import {addUtility} from '../api.ts';
import {useState} from 'react';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

function UtilityForm() {
    const {id: flatIdFromParams} = useParams();
    const flatId = flatIdFromParams || localStorage.getItem('flatId'); // Добавил проверку на null/undefined
    const navigate = useNavigate();

    const today = dayjs();
    const currentYear = today.year();
    const currentMonth = today.month();
    const firstDayOfMonth = dayjs().year(currentYear).month(currentMonth).startOf('month'); // Используем startOf('month')
    const lastDayOfMonth = dayjs().year(currentYear).month(currentMonth).endOf('month');     // Используем endOf('month')

    const initialUtilityData = {
        name: '',
        price: '',
        date: null,
        paymentUrl: '', // Добавлено поле для URL оплаты
        flat: {id: parseInt(flatId as string)} // Добавил явное приведение типа
    };

    const [utilityData, setUtilityData] = useState(initialUtilityData);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setMessageType(null);
        setLoading(true);

        if (!utilityData.date) {
            setMessage('Пожалуйста, выберите день передачи показаний.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        // Валидация URL
        if (utilityData.paymentUrl && !isValidUrl(utilityData.paymentUrl)) {
            setMessage('Пожалуйста, введите корректный URL для оплаты.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        const formattedDate = utilityData.date.toISOString();

        const formattedUtilityData = {
            ...utilityData,
            price: parseFloat(utilityData.price),
            date: formattedDate
        };

        try {
            await addUtility(formattedUtilityData);
            setMessage('Коммунальный платеж успешно добавлен!');
            setMessageType('success');
            setUtilityData(initialUtilityData); // Reset form
        } catch (error) {
            setMessage('Ошибка при добавлении коммунального платежа.');
            setMessageType('error');
            console.error('Error adding utility:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUtilityData({...utilityData, [name]: value});
    };

    const handleBack = () => {
        navigate(`/flat/${flatId}`);
    };

    // Функция для валидации URL
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="ru">
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
                        type="number"
                        style={{marginBottom: '20px'}}
                    />
                    <TextField
                        label="URL для оплаты"
                        variant="outlined"
                        fullWidth
                        name="paymentUrl"
                        value={utilityData.paymentUrl}
                        onChange={handleChange}
                        style={{marginBottom: '20px'}}
                    />
                    <DatePicker
                        label="День передачи показаний"
                        value={utilityData.date}
                        onChange={(newDate) => {
                            setUtilityData({...utilityData, date: newDate});
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                required
                                helperText="Выберите день передачи показаний в текущем месяце (максимальный день для оплаты)" // Изменил helperText
                            />
                        )}
                        minDate={firstDayOfMonth}
                        maxDate={lastDayOfMonth}
                        views={['day']} // Ограничиваем видимость только днем
                        // disableMaskedInput // Удалил, так как он устарел и не нужен
                    />
                    <div style={{marginTop: '20px'}}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            style={{marginRight: '10px'}}
                        >
                            Добавить
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            Назад
                        </Button>
                    </div>
                </form>
            </div>
        </LocalizationProvider>
    );
}

export default UtilityForm;