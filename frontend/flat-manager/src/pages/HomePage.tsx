import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, getUserFlats } from './api.ts';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [flats, setFlats] = useState([]);

    useEffect(() => {
        if (location.state && location.state.user) {
            const fetchUserDetails = async () => {
                try {
                    const response = await getUser(location.state.user.username);
                    setUser(response.data);
                    const flatsResponse = await getUserFlats(response.data.id);
                    setFlats(flatsResponse.data);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };
            fetchUserDetails();
        }
    }, [location]);

    const handleLogout = () => {
        navigate('/login');
    };

    const handleAddFlat = () => {
        navigate('/add-flat');
    };

    const getWelcomeMessage = () => {
        if (user) {
            if (user.first_name && user.last_name) {
                return `Добро пожаловать, ${user.first_name} ${user.last_name}!`;
            } else {
                return `Добро пожаловать, user${user.id}!`;
            }
        }
        return '';
    };

    return (
        <div>
            <h1>{getWelcomeMessage()}</h1>
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Выйти
            </Button>
            <Button variant="contained" color="primary" onClick={handleAddFlat} style={{ margin: '10px' }}>
                Добавить квартиру
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Адрес</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flats.map((flat) => (
                            <TableRow key={flat.flat_id}>
                                <TableCell>{flat.flat_id}</TableCell>
                                <TableCell>{flat.name}</TableCell>
                                <TableCell>{flat.address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default HomePage;