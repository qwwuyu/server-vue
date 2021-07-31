"use strict";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import titleVue from "./components/Title.vue";

import defaultAxios from "./net.js";
Vue.prototype.$axios = defaultAxios;

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component("titleVue", titleVue);

import store from "./store";

import util from "./util.js";
Vue.prototype.$util = util;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
