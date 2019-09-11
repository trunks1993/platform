// eslint-disable-next-line import/newline-after-import
import { getToken, setToken, removeToken } from '@/utils/auth';
// eslint-disable-next-line import/no-cycle
import { login, getUserInfo, getMenuTree } from '@/api/app';

const _import = require(`@/router/_import_${ process.env.NODE_ENV}`);

function getRouterMap(menuList) {
  menuList.filter((item) => {
    item.component = _import(item.component);
    if (item.children && item.children.length > 0) {
      getRouterMap(item.children);
    }
  });
  return menuList;
}

export default {
  state: {
    userInfo: {},
    routers: [],
    token: getToken(),
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      // eslint-disable-next-line semi
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_ROUTERS: (state, routers) => {
      state.routers = routers;
    },
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(userInfo).then(({ token }) => {
          commit('SET_TOKEN', token);
          setToken(token);
          resolve(token);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve) => {
        getUserInfo().then((res) => {
          commit('SET_USERINFO', res);
          resolve();
        });
      });
    },
    // 获取用户菜单
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        getMenuTree().then((res) => {
          // commit('SET_SIDEBAR', res);
          // resolve(res);
          const asyncRouterMap = getRouterMap(res);
          asyncRouterMap.push({ path: '*', redirect: '/404', hidden: true });
          commit('SET_ROUTERS', asyncRouterMap);
          resolve(asyncRouterMap);
        });
      });
    },
    // 前端 登出
    FedLogOut({ commit }) {
      commit('SET_TOKEN', '');
      removeToken();
    },
  },
};
