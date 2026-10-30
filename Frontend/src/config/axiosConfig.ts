import axios from "axios";
import { config } from "../config";

const axiosInstance = axios.create({
    baseURL: config.Api,
    withCredentials:true,
    timeout:60000
})

axiosInstance.interceptors.request.use(
  (requestConfig) => {
    console.log(
      `[AXIOS →] ${requestConfig.method?.toUpperCase()} ${requestConfig.baseURL}${requestConfig.url}`
    );
    const token = localStorage.getItem('token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
      console.log('[AXIOS →] Token agregado al header');
    } else {
      console.warn('[AXIOS →] Sin token en localStorage');
    }
    return requestConfig;
  },
  (error) => {
    console.error('[AXIOS →] Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `[AXIOS ←] ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.warn(
      `[AXIOS ←] ERROR ${error.response?.status} ${error.config?.url}`,
      error.response?.data
    );

    if (error.response?.status === 401) {
      console.warn('[AXIOS] 401 → limpiando token');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('app:auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance