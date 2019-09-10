// eslint-disable-next-line import/newline-after-import
import { getToken, setToken } from '@/utils/auth';
// eslint-disable-next-line import/no-cycle
import { login, getUserInfo, getSidebar } from '@/api/app';

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
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_SIDEBAR: (state, sideBar) => {
      state.sideBar = sideBar;
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
    GetUserInfo({ commit }){
      return new Promise((resolve, reject) => {
        getUserInfo(getToken()).then((res) => {
        
        })
      })
    },
  },
  // 获取用户信息
  GetUserInfo({ commit }) {
    return new Promise((resolve) => {
      getUserInfo(getToken()).then((res) => {
        commit('SET_USERINFO', res.data.data);
        resolve(true);
      });
    });
  },
  // 获取用户菜单
  GetSidebar({ commit }, token, userId) {
    return new Promise((resolve) => {
      getSidebar(token, userId).then((res) => {
        commit('SET_SIDEBAR', res.data.data);
        resolve(res.data.data);
      });
    });
  },
};
