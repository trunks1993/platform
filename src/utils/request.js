import axios from 'axios';
import store from '../store';
import { getToken } from '@/utils/auth';

const baseURL = process.env.NODE_ENV === 'production' ? 'http:/192.168.0.1' : 'http:/192.168.0.2';
// 创建axios实例
const service = axios.create({
  // baseURL: `${baseURL}/api`, // api的base_url
  timeout: 150000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    // eslint-disable-next-line no-param-reassign
    config.headers['X-Token'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}, (error) => {
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => response,
  error =>
    // console.log('err' + error) // for debug
    // Message.error(error.message)
    // eslint-disable-next-line implicit-arrow-linebreak
    Promise.reject(error)
  ,
);

export default service;
