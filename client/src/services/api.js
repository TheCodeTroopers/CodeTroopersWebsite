import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const getTeam = () => api.get('/team');
export const getEvents = (type) => api.get('/events', { params: type ? { type } : {} });
export const getGallery = () => api.get('/gallery');
export const getAchievements = () => api.get('/achievements');
export const getContactInfo = () => api.get('/contact-info');
export const submitContact = (data) => api.post('/contact', data);
export const submitApplication = (formData) => api.post('/applications', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
