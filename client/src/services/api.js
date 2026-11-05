import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ct_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: automatically catch expired / revoked sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const isAuthRoute = window.location.pathname.startsWith('/admin');
      const hadToken = Boolean(localStorage.getItem('ct_auth_token'));
      if (isAuthRoute && hadToken && error.response.status === 401) {
        localStorage.removeItem('ct_auth_token');
        localStorage.removeItem('ct_auth_user');
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}&expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const googleAuthUser = (payload) => api.post('/auth/google', payload);
export const getCurrentUser = () => api.get('/auth/me');
export const getUsers = () => api.get('/auth/users');
export const updateUserRole = (id, role) => api.put(`/auth/users/${id}/role`, { role });

// Team APIs
export const getTeam = () => api.get('/team');
export const createMember = (data) => api.post('/team', data);
export const updateMember = (id, data) => api.put(`/team/${id}`, data);
export const deleteMember = (id) => api.delete(`/team/${id}`);

// Events APIs
export const getEvents = (type) => api.get('/events', { params: type ? { type } : {} });
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Achievements APIs
export const getAchievements = () => api.get('/achievements');
export const createAchievement = (data) => api.post('/achievements', data);
export const updateAchievement = (id, data) => api.put(`/achievements/${id}`, data);
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`);

// Blogs APIs
export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlogById = (id) => api.get(`/blogs/${id}`);
export const createBlog = (data) => api.post('/blogs', data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

// Gallery APIs
export const getGallery = () => api.get('/gallery');
export const createGalleryItem = (data) => api.post('/gallery', data);
export const updateGalleryItem = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);

// Contact & Site Settings APIs
export const getContactInfo = () => api.get('/contact-info');
export const updateContactInfo = (data) => api.put('/contact-info', data);
export const submitContact = (data) => api.post('/contact', data);
export const getContactSubmissions = () => api.get('/contact/submissions');
export const deleteContactSubmission = (id) => api.delete(`/contact/submissions/${id}`);

// Recruitment & Join Us Applications APIs
export const getApplications = (params) => api.get('/recruitment/applications', { params });
export const getApplicationById = (id) => api.get(`/recruitment/applications/${id}`);
export const updateApplicationStatus = (id, status) => api.patch(`/recruitment/applications/${id}/status`, { status });
export const deleteApplication = (id) => api.delete(`/recruitment/applications/${id}`);
export const getRecruitmentStats = () => api.get('/recruitment/stats');

export default api;
