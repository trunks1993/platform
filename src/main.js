import Vue from 'vue';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import App from './App';
import router from './router';
import store from './store';
import './permission'; // 权限
import './styles/index.scss'; // global css
import './mock';
Vue.use(ElementUI);
console.log('process.env.BASE_API', process.env);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
