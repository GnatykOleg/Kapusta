import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

axios.defaults.baseURL = 'https://kapusta-backend.goit.global';

const token = {
    set(token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    unset() {
        axios.defaults.headers.common.Authorization = '';
    },
};

const register = createAsyncThunk(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/register', credentials);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const logIn = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/login', credentials);

            token.set(data.accessToken);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const googleLogIn = createAsyncThunk(
    'auth/goggle',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/goggle', credentials);
            token.set(data.token);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const logOut = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post('/auth/logout');
            token.unset();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const refreshUser = createAsyncThunk(
    'auth/refresh',
    async (_, { rejectWithValue, getState }) => {
        const state = getState();
        const persistedToken = state.auth.refreshToken;
        const persistedSid = { sid: state.auth.sid };

        if (persistedToken === null) {
            return rejectWithValue();
        }

        token.set(persistedToken);
        try {
            const { data } = await axios.post('/auth/refresh', persistedSid);
            token.set(data.newAccessToken);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const authOperations = {
    register,
    logOut,
    googleLogIn,
    logIn,
    refreshUser,
};
export default authOperations;
