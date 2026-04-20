import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/quantities`,
});

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`,
});

// Intercept requests and add Bearer token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await authApi.post('/login', { username, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await authApi.post('/register', { username, email, password });
  return response.data;
};

export const compareQuantities = async (thisQuantity, thatQuantity) => {
  const response = await api.post('/compare', {
    thisQuantityDTO: thisQuantity,
    thatQuantityDTO: thatQuantity,
  });
  return response.data;
};

export const convertQuantity = async (thisQuantity, thatQuantity) => {
  const response = await api.post('/convert', {
    thisQuantityDTO: thisQuantity,
    thatQuantityDTO: thatQuantity,
  });
  return response.data;
};

export const addQuantities = async (thisQuantity, thatQuantity) => {
  const response = await api.post('/add', {
    thisQuantityDTO: thisQuantity,
    thatQuantityDTO: thatQuantity,
  });
  return response.data;
};

export const subtractQuantities = async (thisQuantity, thatQuantity) => {
  const response = await api.post('/subtract', {
    thisQuantityDTO: thisQuantity,
    thatQuantityDTO: thatQuantity,
  });
  return response.data;
};

export const divideQuantities = async (thisQuantity, thatQuantity) => {
  const response = await api.post('/divide', {
    thisQuantityDTO: thisQuantity,
    thatQuantityDTO: thatQuantity,
  });
  return response.data;
};

export const getHistoryByOperation = async (operation) => {
  const response = await api.get(`/history/operation/${operation}`);
  return response.data;
};

export const getHistoryByType = async (type) => {
  const response = await api.get(`/history/type/${type}`);
  return response.data;
};

export const getErrorHistory = async () => {
  const response = await api.get(`/history/errored`);
  return response.data;
};

export const getOperationCount = async (operation) => {
  const response = await api.get(`/count/${operation}`);
  return response.data;
};
