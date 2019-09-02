// import { getMenuList } from '@/api/login';
// const _import = require(`@/router/_import_${ process.env.NODE_ENV}`);

// function getRouterMap(menuList) {
//   menuList.filter((item) => {
//     item.component = _import(item.component);
//     if (item.children && item.children.length > 0) {
//       getRouterMap(item.children);
//     }
//   });
//   return menuList;
// }

export default {
  state: {
    user: {},
    routers: [],
  },
  mutations: {
  },
  actions: {
  },
};
