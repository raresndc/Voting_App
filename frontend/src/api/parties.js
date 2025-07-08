import { API_ROOT } from './root';

export const listParties = () =>
  API_ROOT.get('/parties');
