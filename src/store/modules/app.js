// eslint-disable-next-line import/newline-after-import
import { getToken, setToken } from '@/utils/auth';
// eslint-disable-next-line import/no-cycle
import { login } from '@/api/app';

export default {
  state: {
    userInfo: {},
    routers: [],
    token: getToken(),
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      // eslint-disable-next-line semi
      state.token = token
    },
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then((response) => {
          const { data } = response;
          if (data.code === 0 && data.msg === 'success') {
            commit('SET_TOKEN', data.data.token);
            setToken(data.data.token);
          }
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
};
