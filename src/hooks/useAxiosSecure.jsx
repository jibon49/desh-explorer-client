import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000/", 
});

const useAxiosSecure = () => {
  
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn("Unauthorized or Forbidden request", error);
        localStorage.removeItem("access-token");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
