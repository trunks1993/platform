import request from '@/utils/request';

// export default (username, password) => request({
//   url: '/user/login',
//   method: 'post',
//   params: {
//     username,
//     password,
//   },
// });

export const login = (params) => request({
  url: '/cas/login',
  method: 'post',
  params: params
});
// 获取用户菜单
export const getMenuTree = () => request({
  url: '/v1/menu/listById',
  method: 'post',
});
// 获取用户权限
export const getUserInfo = () => request({
  url: '/v1/api/user/SysUser/user',
  method: 'get',
});
