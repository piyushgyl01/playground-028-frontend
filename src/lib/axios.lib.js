import axios from 'axios';
import Cookies from 'js-cookie';

// Base API instance with auth interceptor
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// OAuth API instances
export const authServerAxios = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}`,
  withCredentials: true,
});

export const githubApiAxios = axios.create({
  baseURL: `${import.meta.env.VITE_GITHUB_API_BASE_URL}`,
});

export const googleApiAxios = axios.create({
  baseURL: `https://www.googleapis.com/oauth2/v2`,
});