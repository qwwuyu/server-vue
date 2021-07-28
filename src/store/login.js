import Cookies from "js-cookie";
import { Base64 } from "js-base64";

let loginInfo = {};
let isLogin = false;
let token = Cookies.get("token");
if ("string" == typeof token) {
  isLogin = true;
  loginInfo = JSON.parse(Base64.decode(token));
} else {
  Cookies.remove("token");
}

export default {
  namespaced: true, // 带命名空间，相当于这个模块中的内容是独立的
  state: {
    login: isLogin,
    info: loginInfo
  },
  mutations: {
    login(state, token) {
      Cookies.set("token", token, {
        expires: 7 * 86400
      });
      state.login = true;
      state.info = JSON.parse(Base64.decode(token));
    },
    logout(state) {
      state.login = false;
      state.info = {};
    }
  },
  getters: {
    getLogin(state) {
      return state.login;
    }
  }
};
