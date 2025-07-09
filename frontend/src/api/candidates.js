import API from './auth';

export const getCandidate      = (id)   => API.get(`/api/candidates/${id}`);
export const updateCandidate   = (id, data) => API.put(`/api/candidates/${id}`, data);
export const addCandidate      = (data) => API.post('/api/candidates/addCandidate', data);
