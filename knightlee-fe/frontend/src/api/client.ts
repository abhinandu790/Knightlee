// // api/client.ts
import axios from "axios";

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
// api/client.ts


// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// });

// // attach JWT only for protected endpoints
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access");
//   const url = config.url || "";

//   // 👇 list all PUBLIC endpoints here (no auth required)
//   const isPublicEndpoint =
//     url.startsWith("/route-analyze/") ||
//     url.startsWith("/blackspots/"); // add more if needed

//   // Only add Authorization header for non-public endpoints
//   if (token && !isPublicEndpoint) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   } else if (isPublicEndpoint && config.headers?.Authorization) {
//     // ensure no leftover Authorization header
//     delete config.headers.Authorization;
//   }

//   return config;
// });

// export default api;



const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Apply JWT only when needed
api.interceptors.request.use((config) => {
  const noAuthEndpoints = [
    "/auth/login/",
    "/auth/register/",
  ];

  // Check if request URL contains a no-auth endpoint
  if (noAuthEndpoints.some((url) => config.url?.includes(url))) {
    return config; // do NOT attach token
  }

  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
