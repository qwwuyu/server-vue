import Cookies from "js-cookie";
import { Base64 } from "js-base64";

let loginInfo = {};
let isLogin = false;
let token = Cookies.get("token");
if ("string" == typeof token) {
  try {
    loginInfo = JSON.parse(Base64.decode(token));
    if (!loginInfo.id) throw new Error();
    isLogin = true;
  } catch (err) {
    loginInfo = {};
  }
}
if (!isLogin) {
  Cookies.remove("token");
}

export default {
  namespaced: true, // 带命名空间，相当于这个模块中的内容是独立的
  state: {
    dLogin: isLogin,
    dInfo: loginInfo,
    dToken: token
  },
  mutations: {
    mLogin(state, token) {
      Cookies.set("token", token, {
        expires: 7 * 86400
      });
      state.dLogin = true;
      state.dInfo = JSON.parse(Base64.decode(token));
      state.dToken = token;
    },
    mLogout(state) {
      Cookies.remove("token");
      state.dLogin = false;
      state.dInfo = {};
    }
  },
  getters: {
    getLogin(state) {
      return state.dLogin;
    }
  }
};
