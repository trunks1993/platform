import request from '@/utils/request';

export default (username, password) => request({
  url: '/user/login',
  method: 'post',
  params: {
    username,
    password,
  },
});
