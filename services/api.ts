import axios from 'axios';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}:3000`;

const api = axios.create({
  baseURL: API_URL || 'http://192.168.8.112:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 