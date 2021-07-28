export default {
  namespaced: true, // 带命名空间，相当于这个模块中的内容是独立的
  state: {
    isLogin: true,
    nick: "Test"
  },
  mutations: {
    changeLogin(state, isLogin) {
      state.isLogin = isLogin;
    }
  },
  getters: {
    getLogin(state) {
      return state.isLogin;
    }
  }
};
