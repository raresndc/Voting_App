import axios from 'axios';

const voteApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_VOTING_API_BASE,
  withCredentials: true,
});

export default voteApi;