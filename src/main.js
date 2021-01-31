'use strict';

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import titleVue from "./components/Title.vue";


import Axios from 'axios';
Vue.prototype.$axios = Axios;
Axios.defaults.baseURL = 'http://localhost/';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component("titleVue",titleVue);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
