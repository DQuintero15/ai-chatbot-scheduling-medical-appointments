import axios from "axios";
import { API_URL } from "src/config";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;