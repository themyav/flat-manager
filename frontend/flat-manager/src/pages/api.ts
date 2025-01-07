import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api';

export const registerUser = async (userData) => {
    try {
        return await axios.post(`${BASE_URL}/users/register`, userData);
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        return await axios.post(`${BASE_URL}/users/login`, userData);
    } catch (error) {
        throw error;
    }
};

export const getUser = async (username) => {
    try {
        return await axios.get(`${BASE_URL}/users/${username}`);
    } catch (error) {
        throw error;
    }
};

export const getUserFlats = async (userId) => {
    try {
        return await axios.get(`${BASE_URL}/users/flats/${userId}`);
    } catch (error) {
        throw error;
    }
};

export const addFlat = async (flatData) => {
    try {
        return await axios.post(`${BASE_URL}/flats`, flatData);
    } catch (error) {
        throw error;
    }
};