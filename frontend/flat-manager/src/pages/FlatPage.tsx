import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
    Grid,
    Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
    updateFlat,
    deleteUtility,
    getFlat,
    getUtilityPaymentsByFlatIdAndDate,
    checkPayment,
    getPaymentStatus,  // Import the new API functions
    getPriceHistory
} from './api.ts';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import 'dayjs/locale/ru'; // Import Russian locale
import { styled } from '@mui/system'; // Import styled

// Styled component for the main container
const FlatPageContainer = styled('div')({
    padding: '20px',
    maxWidth: '1000px', // Added max width for better layout on large screens
    margin: '0 auto', // Center the content
});


function FlatPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [flat, setFlat] = useState(null);
    const [utilities, setUtilities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFlat, setEditedFlat] = useState({
        name: '',
        address: ''
    });
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [paidUtilities, setPaidUtilities] = useState({});

    // New states for statistics
    const [paymentStatus, setPaymentStatus] = useState<any>(null);
    const [priceHistory, setPriceHistory] = useState<any>(null);
    const [statsStartDate, setStatsStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'year')); // Default to 1 year ago
    const [statsEndDate, setStatsEndDate] = useState<Dayjs | null>(dayjs()); // Default to today


    const fetchFlatData = useCallback(async () => {
        if (!id) return;

        try {
            const response = await getFlat(id);
            setFlat(response.data);
            setEditedFlat({
                name: response.data.name,
                address: response.data.address
            });
        } catch (error) {
            console.error('Error fetching flat:', error);
        }
    }, [id]);

    const fetchUtilities = useCallback(async (date: Dayjs) => { // Type date as Dayjs
        if (!id) return;

        try {
            const date_string = date.format('01.MM.YYYY');
            const resp = await getUtilityPaymentsByFlatIdAndDate(parseInt(id), date_string);
            const ut_arr: any[] = []; // Type explicitly as any[]
            const paidStatus: { [key: number]: boolean } = {}; // Type explicitly

            resp.data.forEach((payment: any) => { // Type explicitly
                ut_arr.push(payment.utility);
                paidStatus[payment.utility.id] = payment.isPaid || false;
            });

            setUtilities(ut_arr);
            setPaidUtilities(paidStatus);
        } catch (error) {
            console.error('Error fetching utilities:', error);
        }
    }, [id]);

    // New function to fetch statistics
    const fetchStatistics = useCallback(async () => {
        if (!id || !statsStartDate || !statsEndDate) return;

        try {
            const startDateString = statsStartDate.format('YYYY-MM');
            const endDateString = statsEndDate.format('YYYY-MM');

            const paymentStatusResponse = await getPaymentStatus(parseInt(id), startDateString, endDateString);
            console.log('resp is: ', paymentStatusResponse)
            setPaymentStatus(paymentStatusResponse.data);

            const priceHistoryResponse = await getPriceHistory(parseInt(id), startDateString, endDateString);
            setPriceHistory(priceHistoryResponse.data);

        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }, [id, statsStartDate, statsEndDate]); // Include dependencies


    useEffect(() => {
        if (id) {
            fetchFlatData();
            fetchUtilities(selectedDate);
        }
    }, [fetchFlatData, fetchUtilities, id, selectedDate]);

    useEffect(() => {
        if (flat) {
            setEditedFlat({
                name: flat.name,
                address: flat.address
            });
        }
    }, [flat]);

    // Fetch statistics whenever the date range changes
    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);


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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Type the event
        const { name, value } = e.target;
        setEditedFlat(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString: string) => { // Type dateString
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const handleCheckboxChange = (utilityId: number) => { // Type utilityId
        setPaidUtilities((prev) => {
            const newPaid = { ...prev };
            newPaid[utilityId] = !prev[utilityId];
            return newPaid;
        });
        checkPayment(utilityId);
    };

    const handleAddUtility = () => {
        if (flat?.id) {  // Check for flat.id before navigating
            localStorage.setItem('flatId', String(flat.id));
            navigate(`/add-utility/${flat.id}`);
        }
    };
    const handleBack = () => {
        localStorage.removeItem('flatId');
        navigate('/home');
    };

    const handleUtilityDetails = (utility: any) => { // Type utility
        if(flat?.id){
            localStorage.setItem('flatId', String(flat.id));
            navigate(`/utility/${utility.id}`, { state: { utility } });
        }

    };

    const handleUtilityDelete = async (utilityId: number) => { // Type utilityId
        try {
            await deleteUtility(utilityId);
            fetchUtilities(selectedDate);
        } catch (error) {
            console.error('Error deleting utility:', error);
        }
    };
    const handleDateChange = (newValue: Dayjs | null) => { // Type newValue
        if (newValue) {
            setSelectedDate(newValue);
            fetchUtilities(newValue);
        }

    };

    const unpaidCount = utilities.filter((u) => !paidUtilities[u.id]).length;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <FlatPageContainer>
                <h1>Информация о квартире</h1>

                {/* Edit Flat Form */}
                {isEditing ? (
                    <Box mb={3}>
                        <TextField
                            label="Название"
                            name="name"
                            value={editedFlat.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Адрес"
                            name="address"
                            value={editedFlat.address}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{ mr: 2 }}
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
                    </Box>
                ) : (
                    <Box mb={3}>
                        <Typography variant="h6">Название: {flat?.name}</Typography>
                        <Typography variant="h6">Адрес: {flat?.address}</Typography>
                        <Button variant="outlined" onClick={handleEdit} sx={{ mt: 1 }}>
                            Редактировать
                        </Button>
                    </Box>
                )}

                {/* Date Picker for Utilities */}
                <Box mb={3}>
                    <DatePicker
                        views={['year', 'month']}
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </Box>

                {/* Utilities Table */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {unpaidCount === 0
                        ? 'Все услуги оплачены в этом месяце'
                        : `Количество услуг к оплате: ${unpaidCount}`}
                </Typography>

                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Оплачено</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {utilities.map((utility) => (
                                <TableRow
                                    key={utility.id}
                                    sx={{
                                        backgroundColor: paidUtilities[utility.id]
                                            ? '#d0f0c0'
                                            : '#f8d7da'
                                    }}
                                >
                                    <TableCell>{utility.id}</TableCell>
                                    <TableCell>{utility.name}</TableCell>
                                    <TableCell>{utility.price}</TableCell>
                                    <TableCell>{formatDate(utility.date)}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={paidUtilities[utility.id] || false}
                                            onChange={() => handleCheckboxChange(utility.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleUtilityDetails(utility)}
                                            sx={{ mr: 1 }}
                                        >
                                            <InfoIcon />
                                        </Button>
                                        <Button onClick={() => handleUtilityDelete(utility.id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button variant="contained" color="primary" onClick={handleAddUtility} sx={{ mb: 2 }}>
                    Добавить услугу
                </Button>
                <Button variant="outlined" color="primary" onClick={handleBack} sx={{ ml: 2, mb: 2 }}>
                    Назад
                </Button>


                {/* Statistics Section */}
                <Typography variant="h5" gutterBottom>
                    Статистика
                </Typography>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item>
                        <DatePicker
                            label="Начальная дата"
                            value={statsStartDate}
                            onChange={(newValue) => setStatsStartDate(newValue)}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />

                    </Grid>
                    <Grid item>
                        <DatePicker
                            label="Конечная дата"
                            value={statsEndDate}
                            onChange={(newValue) => setStatsEndDate(newValue)}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={fetchStatistics}>
                            Показать статистику
                        </Button>
                    </Grid>
                </Grid>


                {paymentStatus && (
                    <Box mb={3}>
                        <Typography variant="h6">Статус оплаты:</Typography>
                        <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>
                    </Box>
                )}

                {priceHistory && (
                    <Box>
                        <Typography variant="h6">История цен:</Typography>
                        <pre>{JSON.stringify(priceHistory, null, 2)}</pre>
                    </Box>
                )}

            </FlatPageContainer>
        </LocalizationProvider>
    );
}

export default FlatPage;