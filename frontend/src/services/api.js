import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This ensures cookies (refresh tokens) are sent
});

// Store access token in memory (safer than localStorage)
let accessToken = localStorage.getItem("access_token");

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call refresh endpoint (refresh token should be in httpOnly cookie)
        const refreshResponse = await api.post("/api/auth/refresh");
        
        // Update the access token from response
        const newAccessToken = refreshResponse.data.tokens?.access_token || 
                               refreshResponse.data.access_token;
        
        if (newAccessToken) {
          // Update in-memory token
          accessToken = newAccessToken;
          // Update localStorage (optional, for persistence)
          localStorage.setItem("access_token", newAccessToken);
        }
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear everything and redirect to login
        accessToken = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  googleLogin: (token) => api.post("/api/auth/google-login", { token }),
  getCurrentUser: () => api.get("/api/auth/me"),
  logout: () => {
    accessToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return api.post("/api/auth/logout");
  },
};

export const employeeAPI = {
  getEmployees: (params) => api.get("/api/employees", { params }),
  getEmployee: (id) => api.get(`/api/employees/${id}`),
  createEmployee: (data) => api.post("/api/employees", data),
  updateEmployee: (id, data) => api.put(`/api/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/api/employees/${id}`),
};

// Export function to update token (for login)
export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("access_token", token);
};

export const getAccessToken = () => accessToken;

export default api;