import Vue from 'vue';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import App from './App';
import router from './router';
import store from './store';
import './permission'; // 权限
import './styles/index.scss'; // global css
<<<<<<< HEAD
import '../src/mock/index';
=======
import './mock';
>>>>>>> 8d502cccdd49ebf6ff7fa664e0de751467e0cb7c

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

