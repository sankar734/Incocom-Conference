import axios from 'axios';

export const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({ baseURL: BASE, timeout: 30000 });

API.interceptors.request.use(cfg => {
  const tok = localStorage.getItem('adminToken');
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`;
  return cfg;
}, Promise.reject);

API.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401 &&
      window.location.pathname.startsWith('/admin') &&
      !window.location.pathname.includes('/login')) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = '/admin/login';
  }
  return Promise.reject(err);
});

// Registration
export const submitRegistration = fd => API.post('/registration/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
export const getRegistrationStatus = id => API.get(`/registration/status/${encodeURIComponent(id)}`);

// Auth
export const adminLogin  = c  => API.post('/auth/login', c);
export const verifyToken = () => API.get('/auth/verify');

// Admin
export const getDashboardStats  = ()      => API.get('/admin/dashboard');
export const getAllRegistrations = p       => API.get('/admin/registrations', { params: p });
export const updateStatus       = (id, d) => API.patch(`/admin/registrations/${id}/status`, d);
export const exportExcelUrl     = status  => `${BASE}/admin/registrations/export-excel${status ? '?status=' + status : ''}`;
export const downloadPaperUrl   = id      => `${BASE}/admin/registrations/${id}/download`;
export const screenshotViewUrl  = id      => `${BASE}/admin/registrations/${id}/screenshot`;

// Payment
export const getPaymentDetails = id => API.get(`/payment/details/${encodeURIComponent(id)}`);
export const submitPayment     = fd => API.post('/payment/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });

export default API;
