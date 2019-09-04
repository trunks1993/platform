import request from '@/utils/request';

// export default (username, password) => request({
//   url: '/user/login',
//   method: 'post',
//   params: {
//     username,
//     password,
//   },
// });

export const login = (username, password) => request({
  url: '/cas/login',
  method: 'post',
  params: {
    username,
    password,
  },
});

export const loginii = (username, password) => request({
  url: '/user/login',
  method: 'post',
  params: {
    username,
    password,
  },
});
