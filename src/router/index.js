import Vue from 'vue';
import Router from 'vue-router';
// import Login from '@/views/login';
const _import = require('./_import_' + process.env.NODE_ENV)

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
      component: _import('/dashboard'),
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
