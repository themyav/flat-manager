import * as React from 'react';
import Button from '@mui/material/Button';
import {useNavigate, useLocation} from 'react-router-dom';
import {getUser, getUserFlats, deleteFlat} from './api.ts';
import {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [flats, setFlats] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchUserFlats(storedUser.id);
        } else if (location.state && location.state.user) {
            const fetchUserDetails = async () => {
                try {
                    const response = await getUser(location.state.user.username);
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    const flatsResponse = await getUserFlats(response.data.id);
                    setFlats(flatsResponse.data);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };
            fetchUserDetails();
        }
    }, [location]);

    const fetchUserFlats = async (userId) => {
        try {
            const flatsResponse = await getUserFlats(userId);
            setFlats(flatsResponse.data);
        } catch (error) {
            console.error('Error fetching user flats:', error);
        }
    };

    const handleDelete = async (flatId) => {
        try {
            await deleteFlat(flatId);
            // Refresh the flats list
            if (user) {
                fetchUserFlats(user.id);
            }
        } catch (error) {
            console.error('Error deleting flat:', error);
        }
    };

    const handleDetails = (flat) => {
        navigate(`/flat/${flat.id}`, {state: {flat}});
    };

    const handleLogout = () => {
        // Clear user from localStorage on logout
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleAddFlat = () => {
        navigate('/add-flat');
    };

    const handleEditUser = () => {
        navigate(`/user/${user.id}`, {state: {user}});
    }

    const getWelcomeMessage = () => {
        if (user) {
            if (user.firstName && user.lastName) {
                return `Добро пожаловать, ${user.firstName} ${user.lastName}!`;
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
            <Button variant="contained" color="primary" onClick={handleAddFlat} style={{margin: '10px'}}>
                Добавить квартиру
            </Button>
            <Button variant="contained" color="primary" onClick={handleEditUser} style={{margin: '10px'}}>
                Редактировать профиль
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flats.map((flat) => (
                            <TableRow key={flat.id}>
                                <TableCell>{flat.id}</TableCell>
                                <TableCell>{flat.name}</TableCell>
                                <TableCell>{flat.address}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<InfoIcon/>}
                                        onClick={() => handleDetails(flat)}
                                        style={{marginRight: '10px'}}
                                    >
                                        Подробнее
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteIcon/>}
                                        onClick={() => handleDelete(flat.id)}
                                    >
                                        Удалить
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default HomePage;