import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    Button,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from 'dayjs';
import {getPaymentStatus, getPriceHistory} from '../api.ts';
import {styled} from '@mui/system';

const StatsPageContainer = styled('div')({
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
});

const StatsCard = styled(Paper)({
    padding: '20px',
    marginBottom: '20px',
});

function StatsPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState<any>(null);
    const [priceHistory, setPriceHistory] = useState<any>(null);
    const [statsStartDate, setStatsStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'year'));
    const [statsEndDate, setStatsEndDate] = useState<Dayjs | null>(dayjs());

    const fetchStatistics = useCallback(async () => {
        if (!id || !statsStartDate || !statsEndDate) return;

        try {
            const startDateString = statsStartDate.format('YYYY-MM');
            const endDateString = statsEndDate.format('YYYY-MM');

            const paymentStatusResponse = await getPaymentStatus(parseInt(id), startDateString, endDateString);
            setPaymentStatus(paymentStatusResponse.data);

            const priceHistoryResponse = await getPriceHistory(parseInt(id), startDateString, endDateString);
            setPriceHistory(priceHistoryResponse.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }, [id, statsStartDate, statsEndDate]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    const handleBack = () => {
        navigate(`/flat/${id}`);
    };

    const formatPaymentStatus = (paymentStatus) => {
        if (!paymentStatus) {
            return null;
        }

        const rows = Object.entries(paymentStatus).sort(([dateA], [dateB]) => dateA.localeCompare(dateB)).map(([date, data]) => ({
            date,
            totalAmount: data.totalAmount,
            paidCount: data.paidCount,
            unpaidCount: data.unpaidCount,
            paidByUtility: Object.entries(data.paidCountByUtility).map(([utility, count]) => `${utility}: ${count}`).join(', ') || '-',
            unpaidByUtility: Object.entries(data.unpaidCountByUtility).map(([utility, count]) => `${utility}: ${count}`).join(', ') || '-',
            totalAmountByUtility: Object.entries(data.totalAmountByUtility).map(([utility, amount]) => `${utility}: ${amount}`).join(', ') || '-',
        }));

        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Месяц</TableCell>
                            <TableCell>Общая сумма</TableCell>
                            <TableCell>Оплачено</TableCell>
                            <TableCell>Не оплачено</TableCell>
                            <TableCell>Оплачено по услугам</TableCell>
                            <TableCell>Не оплачено по услугам</TableCell>
                            <TableCell>Сумма по услугам</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.date}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.totalAmount}</TableCell>
                                <TableCell>{row.paidCount}</TableCell>
                                <TableCell>{row.unpaidCount}</TableCell>
                                <TableCell>{row.paidByUtility}</TableCell>
                                <TableCell>{row.unpaidByUtility}</TableCell>
                                <TableCell>{row.totalAmountByUtility}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const formatPriceHistory = (priceHistory) => {
        if (!priceHistory) {
            return null;
        }

        const rows = Object.entries(priceHistory).map(([utility, history]) => ({
            utility,
            history: history.sort((a, b) => a.date.localeCompare(b.date)),
        }));


        return (
            <>
                {rows.map(({utility, history}) => (
                    <div key={utility}>
                        <Typography variant="h6" gutterBottom>{utility}</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Цена</TableCell>
                                        <TableCell>Оплачено</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.isPaid ? 'Да' : 'Нет'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ))}
            </>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <StatsPageContainer>
                <Typography variant="h4" gutterBottom>
                    Статистика квартиры
                </Typography>

                <Grid container spacing={2} alignItems="center" sx={{mb: 3}}>
                    <Grid item>
                        <DatePicker
                            label="Начальная дата"
                            value={statsStartDate}
                            onChange={(newValue) => setStatsStartDate(newValue)}
                        />
                    </Grid>
                    <Grid item>
                        <DatePicker
                            label="Конечная дата"
                            value={statsEndDate}
                            onChange={(newValue) => setStatsEndDate(newValue)}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={fetchStatistics}>
                            Обновить статистику
                        </Button>
                    </Grid>
                </Grid>

                {paymentStatus && (
                    <StatsCard elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            Статус оплаты:
                        </Typography>
                        {formatPaymentStatus(paymentStatus)}
                    </StatsCard>
                )}

                {priceHistory && (
                    <StatsCard elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            История цен:
                        </Typography>
                        {formatPriceHistory(priceHistory)}
                    </StatsCard>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    sx={{mt: 2}}
                >
                    Назад
                </Button>
            </StatsPageContainer>
        </LocalizationProvider>
    );
}

export default StatsPage;