import axios from "axios";

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar el token de autenticación en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export default api;