import axios from "axios";

const protectedAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

protectedAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

protectedAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const path = window.location.pathname;

      if (
        path === "/" ||
        path === "/users/login" ||
        path === "/users/register" ||
        path.startsWith("/products/")
      ) {
        return Promise.reject(error);
      }

      window.location.href = "/users/login";
    }

    return Promise.reject(error);
  }
);

export default protectedAPI;