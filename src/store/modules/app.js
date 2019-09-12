// eslint-disable-next-line import/newline-after-import
import _ from 'lodash';
import { getToken, setToken, removeToken } from '@/utils/auth';
// eslint-disable-next-line import/no-cycle
import { login, getUserInfo, getMenuTree, getSysUserList } from '@/api/app';

const _import = require(`@/router/_import_${process.env.NODE_ENV}`);

function getRouterMap(menuList) {
  menuList.filter((item) => {
    item.component = _import(item.component);
    if (item.children && item.children.length > 0) {
      getRouterMap(item.children);
    }
  });
  return menuList;
}

const testMenu = [
  {
    menuName: '日誌管理',
    path: '/system',
    parentId: '0',
    component: '/layout',
    children: [
      {
        children: [],
        menuName: '用戶管理',
        path: '/system/user',
        component: '/system/user',
      },
      {
        menuName: '部門管理',
        path: '/system/dept',
        component: '/system/dept',
        children: [
          {
            menuName: '後勤部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
          {
            menuName: '行政部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
        ],
      },
      {
        menuName: '菜單管理',
        path: '/system/menu',
        component: '/system/menu',
        children: [],
      },
    ],
  },
  {
    menuName: '系統管理',
    path: '/system',
    component: '/layout',
    parentId: '0',
    children: [
      {
        children: [],
        menuName: '用戶管理',
        path: '/system/user',
        component: '/system/user',
      },
      {
        menuName: '部門管理',
        path: '/system/dept',
        component: '/system/dept',
        children: [
          {
            menuName: '後勤部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
          {
            menuName: '行政部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
        ],
      },
      {
        menuName: '菜單管理',
        path: '/system/menu',
        component: '/system/menu',
        children: [],
      },
    ],
  },
  {
    menuName: '系統管理',
    path: '/system',
    component: '/layout',
    parentId: '0',
    children: [
      {
        children: [],
        menuName: '用戶管理',
        path: '/system/user',
        component: '/system/user',
      },
      {
        menuName: '部門管理',
        path: '/system/dept',
        component: '/system/dept',
        children: [
          {
            menuName: '後勤部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
          {
            menuName: '行政部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
        ],
      },
      {
        menuName: '菜單管理',
        path: '/system/menu',
        component: '/system/menu',
        children: [],
      },
    ],
  },
  {
    menuName: '系統管理',
    path: '/system',
    component: '/layout',
    parentId: '0',
    children: [
      {
        children: [],
        menuName: '用戶管理',
        path: '/system/user',
        component: '/system/user',
      },
      {
        menuName: '部門管理',
        path: '/system/dept',
        component: '/system/dept',
        children: [
          {
            menuName: '後勤部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
          {
            menuName: '行政部',
            path: '/system/dept',
            component: '/system/dept',
            children: [],
          },
        ],
      },
      {
        menuName: '菜單管理',
        path: '/system/menu',
        component: '/system/menu',
        children: [],
      },
    ],
  },
];

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
          commit('SET_ROUTERS', asyncRouterMap);
          const asyncRouterMapCopy = _.clone(asyncRouterMap);
          asyncRouterMapCopy.push({ path: '*', redirect: '/404', hidden: true });
          resolve(asyncRouterMapCopy);
        });
      });
    },
    // 前端 登出
    FedLogOut({ commit }) {
      commit('SET_TOKEN', '');
      removeToken();
    },
    // 获取用户管理分页
    getUserManagementList({ commit }, obj) {
      return new Promise((resolve, reject) => {
        getSysUserList(obj).then((res) => {
          resolve(res);
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
};
