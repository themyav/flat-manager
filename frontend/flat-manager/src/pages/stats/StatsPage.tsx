import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    Button,
    Typography,
    Grid,
    Paper
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
                        <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>
                    </StatsCard>
                )}

                {priceHistory && (
                    <StatsCard elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            История цен:
                        </Typography>
                        <pre>{JSON.stringify(priceHistory, null, 2)}</pre>
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