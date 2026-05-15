import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5231/api" // update if your backend port is different
});

export default api;