import Vue from "vue";
import Vuex from "vuex";
import login from "./login";
import axios from "../net.js";
import util from "../util.js";

Vue.use(Vuex);

let store = new Vuex.Store({
  modules: {
    eventLogin: login
  }
});

if (store.getters["eventLogin/getLogin"]) {
  checkLogin();
}

function checkLogin() {
  axios({
    url: "/i/checkToken",
    data: {
      token: store.state.eventLogin.dToken
    }
  }).then(response => {
    const data = response.data;
    if (1 == data.state) {
      store.commit("eventLogin/mLogin", store.state.eventLogin.dToken);
    } else if (2 == data.state || 3 == data.state) {
      store.commit("eventLogin/mLogout");
      util.msg(data.info);
    }
  });
}

export default store;
