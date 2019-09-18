import Vue from 'vue';
import Router from 'vue-router';
// import Login from '@/views/login';
<<<<<<< HEAD
const _import = require('./_import_' + process.env.NODE_ENV)
=======
import Layout from '@/views/layout';

const _import = require(`./_import_${  process.env.NODE_ENV}`);
>>>>>>> 3b5aa5f8307e4c2e5e54c470bd71cc5b0bd5fcad

Vue.use(Router);

export const constantRouterMap = [
  { path: '/login', component: _import('/login'), hidden: true },
  { path: '/404', component: _import('/404'), hidden: true },
  {
    path: '/',
    component: _import('/layout'),
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: '首页',
      meta: {
        affix: true,
      },
      component: _import('/dashboard'),
    }],
  },
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});
