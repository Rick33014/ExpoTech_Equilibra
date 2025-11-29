import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333', // Confirme se a porta é 3333 mesmo
});

export default api;