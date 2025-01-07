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

export const deleteFlat = async (flatId) => {
    try {
        return await axios.delete(`${BASE_URL}/flats/${flatId}`);
    } catch (error) {
        throw error;
    }
};

export const updateFlat = async (flatId, flatData) => {
    try {
        return await axios.put(`${BASE_URL}/flats/${flatId}`, flatData);
    } catch (error) {
        throw error;
    }
};

export const getFlatUtilities = async (flatId) => {
    try {
        return await axios.get(`${BASE_URL}/flats/utilities/${flatId}`);
    } catch (error) {
        throw error;
    }
};

export const addUtility = async (utilityData) => {
    try {
        return await axios.post(`${BASE_URL}/utilities`, utilityData);
    } catch (error) {
        throw error;
    }
};

export const getUtility = async (utilityId) => {
    try {
        return await axios.get(`${BASE_URL}/utilities/${utilityId}`);
    } catch (error) {
        throw error;
    }
};
export const updateUtility = async (utilityId, utilityData) => {
    try {
        return await axios.put(`${BASE_URL}/utilities/${utilityId}`, utilityData);
    } catch (error) {
        throw error;
    }
};

export const deleteUtility = async (utilityId) => {
    try {
        return await axios.delete(`${BASE_URL}/utilities/${utilityId}`);
    } catch (error) {
        throw error;
    }
};

export const getFlat = async (id: string) => {
    return axios.get(`${BASE_URL}/flats/${id}`);
};
