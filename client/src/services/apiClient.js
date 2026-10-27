import axios from "axios";

// Axios instance pointed at the upload server. Already configured - do not edit.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
});

export default apiClient;
