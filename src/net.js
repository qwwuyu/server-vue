import Axios from "axios";
const defaultAxios = Axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 5000,
  method: "post",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  transformRequest: [
    data => {
      let formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      return formData;
    }
  ]
});
defaultAxios.interceptors.request.use(
  function(config) {
    if (config.before) {
      config.before();
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
defaultAxios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response) {
      if (404 == error.response.status) {
        error.msg = "请求的地址不存在";
      } else if (504 == error.response.status) {
        error.msg = "服务器连接超时";
      } else {
        error.msg = "请求数据失败";
      }
    } else {
      if ("Network Error" == error.message) {
        error.msg = "网络连接失败";
      } else {
        error.msg = "请求失败";
      }
    }
    return Promise.reject(error);
  }
);

export default defaultAxios;
