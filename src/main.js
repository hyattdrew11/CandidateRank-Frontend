import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import { router } from './router/index.js';
import store from './store';
import './assets/sass/theme.scss'
import './assets/sass/style.scss'
import './assets/sass/scheduler.scss'
import moment from 'moment'
import VueProgressBar from 'vue-progressbar'
import draggable from "vuedraggable";
import axios from 'axios';
import "ag-grid-enterprise";
import {LicenseManager} from "ag-grid-enterprise";
LicenseManager.setLicenseKey("Evaluation_License-_Not_For_Production_Valid_Until_23_July_2019__MTU2MzgzNjQwMDAwMA==870f7edafb7c5f1ab4ea3e323377ea2a");

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(axios);
Vue.use(moment);
Vue.use(draggable);
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
