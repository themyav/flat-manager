import * as React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
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
    Typography
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
    updateFlat,
    deleteUtility,
    getFlat,
    getUtilityPaymentsByFlatIdAndDate, checkPayment
} from './api.ts';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import 'dayjs/locale/ru'; // Import Russian locale

function FlatPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = useParams();
    const [flat, setFlat] = useState(location.state?.flat);
    const [utilities, setUtilities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFlat, setEditedFlat] = useState({
        name: '',
        address: ''
    });
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [paidUtilities, setPaidUtilities] = useState({});

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

    const fetchUtilities = useCallback(async (date) => {
        if (!id) return;

        try {
            const date_string = date.format('01.MM.YYYY');
            const resp = await getUtilityPaymentsByFlatIdAndDate(parseInt(id), date_string);
            const ut_arr = [];
            const paidStatus = {};

            resp.data.forEach((payment) => {
                ut_arr.push(payment.utility);
                paidStatus[payment.utility.id] = payment.isPaid || false;
            });

            setUtilities(ut_arr);
            setPaidUtilities(paidStatus);
        } catch (error) {
            console.error('Error fetching utilities:', error);
        }
    }, [id]);

    useEffect(() => {
        if (!flat && id) {
            fetchFlatData();
        }
        fetchUtilities(selectedDate);
    }, [fetchFlatData, fetchUtilities, flat, id, selectedDate]);

    useEffect(() => {
        if (location.state?.needRefresh) {
            fetchUtilities(selectedDate);
        }
    }, [location.state, fetchUtilities, selectedDate]);

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
        const {name, value} = e.target;
        setEditedFlat(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const handleCheckboxChange = (utilityId) => {
        setPaidUtilities((prev) => {
            const newPaid = {...prev};
            newPaid[utilityId] = !prev[utilityId];
            return newPaid;
        });
        checkPayment(utilityId);
    };

    const handleAddUtility = () => {
        localStorage.setItem('flatId', flat.id);
        navigate(`/add-utility/${flat.id}`);
    };

    const handleBack = () => {
        localStorage.removeItem('flatId');
        navigate('/home');
    };

    const handleUtilityDetails = (utility) => {
        localStorage.setItem('flatId', flat.id);
        navigate(`/utility/${utility.id}`, {state: {utility}});
    };
    const handleUtilityUpdate = async (utilityId, isPaid) => {
        try {
            // Fetch the existing utility
            const utilityToUpdate = utilities.find(u => u.id === utilityId);

            if (!utilityToUpdate) {
                console.error("Utility not found");
                return;
            }
            const updatedUtility = {
                ...utilityToUpdate,
                paid: isPaid,
            }

            // Make API call to update
            await updateFlat(flat.id, {utilities: [{...updatedUtility}]});
        } catch (error) {
            console.error('Error updating: ', error);
        }
    }
    const handleUtilityDelete = async (utilityId) => {
        try {
            await deleteUtility(utilityId);
            fetchUtilities(selectedDate);
        } catch (error) {
            console.error('Error deleting utility:', error);
        }
    };
    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
    };

    const unpaidCount = utilities.filter((u) => !paidUtilities[u.id]).length;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <div style={{padding: '20px'}}>
                <h1>Информация о квартире</h1>

                {isEditing ? (
                    <div style={{marginBottom: '20px'}}>
                        <TextField
                            label="Название"
                            name="name"
                            value={editedFlat.name}
                            onChange={handleChange}
                            fullWidth
                            style={{marginBottom: '10px'}}
                        />
                        <TextField
                            label="Адрес"
                            name="address"
                            value={editedFlat.address}
                            onChange={handleChange}
                            fullWidth
                            style={{marginBottom: '10px'}}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            style={{marginRight: '10px'}}
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
                    <div style={{marginBottom: '20px'}}>
                        <h2>Название: {flat?.name}</h2>
                        <h3>Адрес: {flat?.address}</h3>
                        <Button variant="outlined" onClick={handleEdit} style={{marginTop: '10px'}}>
                            Редактировать
                        </Button>
                    </div>
                )}

                <DatePicker
                    views={['year', 'month']}
                    value={selectedDate}
                    onChange={handleDateChange}
                />

                <Typography variant="h6" style={{margin: '20px 0'}}>
                    {unpaidCount === 0
                        ? 'Все услуги оплачены в этом месяце'
                        : `Количество услуг к оплате: ${unpaidCount}`}
                </Typography>

                <TableContainer component={Paper}>
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
                                    style={{
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
                                            checked={paidUtilities[utility.id]}
                                            onChange={() => handleCheckboxChange(utility.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleUtilityDetails(utility)}
                                            style={{marginRight: '8px'}}
                                        >
                                            <InfoIcon/>
                                        </Button>
                                        <Button onClick={() => handleUtilityDelete(utility.id)}>
                                            <DeleteIcon/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant="contained" color="primary" onClick={handleAddUtility} style={{marginTop: '20px'}}>
                    Добавить услугу
                </Button>
                <Button variant="outlined" color="primary" onClick={handleBack}
                        style={{marginTop: '20px', marginLeft: '10px'}}>
                    Назад
                </Button>
            </div>
        </LocalizationProvider>
    );
}

export default FlatPage;