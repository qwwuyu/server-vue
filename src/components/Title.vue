<template>
  <div>
    <div class="header">
      <div class="header-mask-bg" :style="cssProps"></div>
      <div class="header-content">
        <span class="header-log" data-unselectable="我就打打酱油..."></span>
        <div class="header-anth" v-if="$store.getters['login/getLogin']">
          <ul>
            <li>
              <span v-text="$store.state.login.nick"></span>
            </li>
          </ul>
        </div>
        <div v-else class="header-anth">
          <ul>
            <li @click="showLogin">
              <span>登录</span>
            </li>
            <li @click="showRegister">
              <span>注册</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <el-dialog
      class="loginDialog"
      width="80%"
      max-width="270px"
      :title="isDialogLogin ? '登录' : '注册'"
      :visible.sync="loginDialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <div>
        <form>
          <el-input v-model="acc" maxlength="20" placeholder="帐号" />
          <el-input
            v-model="nick"
            maxlength="20"
            placeholder="昵称"
            v-show="!isDialogLogin"
          />
          <el-input
            v-model="pwd"
            maxlength="20"
            placeholder="密码"
            show-password
          />
          <el-input
            v-model="pwd2"
            maxlength="20"
            placeholder="确认密码"
            show-password
            v-show="!isDialogLogin"
          />

          <div class="login-fun">
            <span style="color: #8b9196;">没有账号？</span>
            <span
              class="clickable"
              v-text="isDialogLogin ? '注册' : '登录'"
              @click="isDialogLogin = !isDialogLogin"
            />
            <a class="clickable forget" @click="forget">忘记密码</a>
          </div>
        </form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Title",
  data() {
    return {
      cssProps: {
        backgroundImage: `url(${require("@/assets/img/head_bg.png")})`
      },
      loginDialog: false,
      isDialogLogin: false,
      acc: "",
      nick: "",
      pwd: "",
      pwd2: ""
    };
  },
  methods: {
    changeLogin() {
      this.$store.commit("login/changeLogin", true);
    },
    showLogin() {
      this.loginDialog = true;
      this.isDialogLogin = true;
    },
    showRegister() {
      this.loginDialog = true;
      this.isDialogLogin = false;
    },
    forget() {
      this.$message("请联系管理员");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";
.header {
  position: fixed;
  width: 100%;
  height: $title-height;
  color: #fff;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 2px;
  z-index: 100;

  .header-mask-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center 0 !important;
    z-index: -100;
  }

  .header-content {
    max-width: $content-width;
    width: 100%;
    margin: 0 auto;
  }

  .header-log {
    line-height: $title-height;
    @extend %unselectable;
  }

  .header-log::before {
    content: attr(data-unselectable);
  }
}

.header-anth {
  float: right;

  li {
    position: relative;
    height: $title-height;
    line-height: $title-height;
    float: left;
    cursor: pointer;
  }

  span {
    display: block;
    padding: 0 12px;
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    @extend %unselectable;
  }

  span:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }
}

.loginDialog {
  .el-input {
    margin-bottom: 6px;
  }

  .login-fun {
    margin: 12px 0 0;

    .forget {
      float: right;
    }
  }
}
</style>
