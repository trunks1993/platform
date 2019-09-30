/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
// eslint-disable-next-line import/no-cycle
import store from '@/store';

// import { getToken } from '@/utils/auth';
const baseURL = process.env.NODE_ENV === 'production' ? 'http://192.168.0.105:9091' : 'http://192.168.0.105:9091';
// 创建axios实例
const service = axios.create({
  baseURL: `${baseURL}/uumsApi`, // api的base_url
  timeout: 5000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.token = store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}, (error) => {
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  ({ data }) => {
    if (data instanceof Blob) return data;
    if (data.code === '0') {
      return data.data;
    } if (data.code === '1') {
      MessageBox.alert(data.msg, {
        confirmButtonText: '确定',
        callback: () => {
          // store.dispatch('FedLogOut');
          // location.reload(); // 为了重新实例化vue-router对象 避免bug
        },
      });
      return Promise.reject('error');
    } if (data.code === '2') {
      MessageBox.alert(data.msg, {
        confirmButtonText: '确定',
        callback: () => {
          store.dispatch('FedLogOut');
          // eslint-disable-next-line no-restricted-globals
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        },
      });
      return Promise.reject('error');
    }
    return Promise.reject('error');
  },
  (error) => {
    // console.log('err' + error) // for debug
    Message.error(error.message);
    Promise.reject(error);
  },
);

export default service;
