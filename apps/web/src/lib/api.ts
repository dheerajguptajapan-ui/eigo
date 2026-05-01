import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token and mock email header
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Send user email for mock token resolution on the server
      if (token.startsWith('mock-token-')) {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const parsed = JSON.parse(user);
            if (parsed.email) config.headers['x-mock-email'] = parsed.email;
          } catch {}
        }
      }
    }
  }
  return config;
});
