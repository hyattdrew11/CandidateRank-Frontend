import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import { router } from './router/index.js';
import store from './store';
import './assets/sass/style.scss'
import moment from 'moment'

import VueProgressBar from 'vue-progressbar'

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(moment);
Vue.use(VueProgressBar, {
  color: '#FFFFFF',
  failedColor: 'red',
  height: '3px'
})

const app = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
