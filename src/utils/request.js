import axios from 'axios';
import store from '@/store';
import { Message, MessageBox } from 'element-ui'

<<<<<<< HEAD
// eslint-disable-next-line no-unused-vars
const baseURL = process.env.NODE_ENV === 'production' ? 'http:/192.168.0.1' : 'http:/192.168.0.2';
=======
// import { getToken } from '@/utils/auth';

const baseURL = process.env.NODE_ENV === 'production' ? 'http://192.168.0.124:9091' : 'http://192.168.0.81:9091'
>>>>>>> 044e5507260aaca9713fb4ba0ae9c004b94cd8ee
// 创建axios实例
const service = axios.create({
  baseURL: `${baseURL}/uumsApi`, // api的base_url
  timeout: 5000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers['token'] = store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}, (error) => {
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  ({ data }) => {
    if (data.code === '0') {
      return data.data
    } else if (data.code === 1) {
      MessageBox.alert(data.msg, {
        confirmButtonText: '确定',
        callback: action => {
          store.dispatch('FedLogOut')
          location.reload() // 为了重新实例化vue-router对象 避免bug
        }
      })
      return Promise.reject('error');
    } else {
      return Promise.reject('error');
    }
  },
  error => {
    // console.log('err' + error) // for debug
    Message.error(error.message)
    Promise.reject(error)
  },
);

export default service;
