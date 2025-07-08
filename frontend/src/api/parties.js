import API from '../api/auth';

export const listParties = () =>
  API.get('/api/parties');
