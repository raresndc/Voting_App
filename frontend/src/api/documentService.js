// src/api/documentService.js
import axios from 'axios';

const documentServiceApi = axios.create({
  baseURL: (
    import.meta.env.VITE_BACKEND_DOCUMENT_API_BASE_DOCUMENTSERVICE ||
    'http://localhost:8081/api'
  ),
  withCredentials: true,    // ⬅️ send the cookie your auth server issued
});

// **DO NOT** add any Authorization interceptor here!
// The cookie will carry your JWT automatically.

export default documentServiceApi;
