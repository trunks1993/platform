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
<<<<<<< HEAD

export const getUserInfo = (username, password) => request({
  url: '/user/login',
=======
// 获取用户菜单
export const getSidebar = (token, userId) => request({
  url: '/v1/menu/list',
>>>>>>> 8d502cccdd49ebf6ff7fa664e0de751467e0cb7c
  method: 'post',
  params: {
    token,
    userId,
  },
});
// 获取用户权限
export const getUserInfo = (token, userId) => request({
  url: '/v1/menu/list',
  method: 'post',
  params: {
    token,
    userId,
  },
});
