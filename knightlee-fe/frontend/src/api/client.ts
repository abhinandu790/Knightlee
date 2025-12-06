// // api/client.ts
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

// api.interceptors.request.use((config) => {
//   const access = localStorage.getItem("access");
//   if (access) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${access}`;
//   }
//   return config;
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
