// api.ts
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

export const registerUser = async (userData) => {
    try {
        return await axios.post(`${BASE_URL}/user/register`, userData);
    } catch (error) {
        throw error; // Re-throw the error to be handled in the component
    }
};

export const loginUser = async (userData) => {
    try {
         //Corrected endpoint
        return await axios.post(`${BASE_URL}/users/login`, userData);
    } catch (error) {
        throw error;
    }
};