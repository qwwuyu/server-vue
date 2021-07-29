import Vue from "vue";
import Vuex from "vuex";
import login from "./login";

Vue.use(Vuex);

let store = new Vuex.Store({
  modules: {
    eventLogin: login
  }
});

export default store;
