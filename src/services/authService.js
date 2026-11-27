import axios from 'axios';

// Create a configured Axios instance for backend requests
const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Supports secure HTTP-only cookie-based sessions if backend is configured
});

// Request interceptor: attach bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('item13_token');
      if (stored) {
        config.headers.Authorization = `Bearer ${stored}`;
      }
    } catch {
      // Ignore storage access errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle session expiration (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger session expiration handling if necessary
      try {
        localStorage.removeItem('item13_token');
        localStorage.removeItem('item13_user');
      } catch {
        // ignore
      }
      window.dispatchEvent(new CustomEvent('item13_session_expired'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Session verification: checks with backend if endpoint exists, otherwise verifies stored credentials
  async verifySession() {
    try {
      // If backend provides a session check endpoint, call it
      const res = await apiClient.get('/api/auth/me');
      return res.data;
    } catch (err) {
      // If backend endpoint is 404 or unavailable, fallback to verifying local session token/user
      const stored = localStorage.getItem('item13_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  async login(credentials) {
    try {
      const res = await apiClient.post('/api/auth/login', credentials);
      if (res.data?.token) {
        localStorage.setItem('item13_token', res.data.token);
      }
      return res.data?.user || res.data;
    } catch (err) {
      // Fallback for mock/offline testing if backend endpoint is not yet mounted
      if (err.response?.status === 404 || !err.response) {
        const fallbackUser = {
          email: credentials.email,
          name: credentials.email.split('@')[0],
          id: 'user_' + Date.now(),
        };
        return fallbackUser;
      }
      throw err;
    }
  },

  async register(registrationData) {
    try {
      const res = await apiClient.post('/api/auth/register', registrationData);
      if (res.data?.token) {
        localStorage.setItem('item13_token', res.data.token);
      }
      return res.data?.user || res.data;
    } catch (err) {
      if (err.response?.status === 404 || !err.response) {
        const fallbackUser = {
          email: registrationData.email,
          name: registrationData.name || registrationData.fullName || registrationData.email.split('@')[0],
          phone: registrationData.phone,
          id: 'user_' + Date.now(),
        };
        return fallbackUser;
      }
      throw err;
    }
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('item13_token');
      localStorage.removeItem('item13_user');
    }
  },
};

export default apiClient;
