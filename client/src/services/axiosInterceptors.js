import axios from "axios";

const api = axios.create({
  baseURL: '',
  withCredentials: true, // If using cookies
});

api.interceptors.request.use(function(config) {
  //check if server
  if(typeof window === 'undefined') {
    //set base url to ingress cluster service
    config.baseURL = process.env.BASE_URL
    console.log("base url", process.env.BASE_URL);
  }

  return config;
}, function(error) {
  return Promise.reject(error)
})


export default api;