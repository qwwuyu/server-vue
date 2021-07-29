<template>
  <div>
    <el-dialog
      class="login-dialog"
      width="80%"
      max-width="270px"
      v-if="isShowDialog"
      :visible.sync="isShowDialog"
      :title="isLogin ? '登录' : '注册'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
    >
      <div>
        <form onsubmit="return false">
          <el-input v-model="acc" maxlength="20" placeholder="帐号" />
          <el-input
            v-model="nick"
            maxlength="20"
            placeholder="昵称"
            v-show="!isLogin"
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
            v-show="!isLogin"
          />
          <el-button
            style="width:100%"
            type="primary"
            native-type="submit"
            v-text="isLogin ? '登录' : '注册'"
            @click="commit"
            :disabled="isCommiting"
          />
          <div class="login-fun">
            <span style="color: #8b9196;">没有账号？</span>
            <span
              class="clickable"
              v-bind:class="isCommiting ? 'dis-click' : ''"
              v-text="isLogin ? '注册' : '登录'"
              @click="isLogin = !isLogin"
            />
            <a class="clickable forget" @click="forget">忘记密码</a>
          </div>
        </form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
function check($, acc, nick, pwd, pwd2) {
  if (!new RegExp("[\\w]{4,}").test(acc)) {
    $.$message("帐号4~20位单词字符");
  } else if (nick.length < 2) {
    $.$message("昵称2~20位");
  } else if (pwd.length < 6) {
    $.$message("密码6~20位");
  } else if (pwd != pwd2) {
    $.$message("两次密码不一致");
  } else {
    return true;
  }
  return false;
}

function bcrypt(acc, pwd) {
  var bcrypt = require("bcryptjs");
  var salt = acc;
  for (var i = acc.length; i < 22; i++) {
    salt = salt + "0";
  }
  salt = "$2a$10$" + salt.replace("_", "/");
  return bcrypt.hashSync(pwd, salt);
}

function rsaEncrypt(str) {
  const JSEncrypt = require("jsencrypt").default;
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCOVmjkpQZsb3F8TYz/M9W3ltco5tGnrktIlTvV9c4w+b5kbt+qMKnbKl11Y4Rk0w706AnnZO+9" +
      "jW8w3snWhJVrJ9wxwJq+rBZJvn8Egi6npXFehRyOEO5lZYIWLNHHN6mB7QIOcQQMGblH0/A6SQdt1LStGuoZ7n2hEcI2V0/cyQIDAQAB"
  );
  return encrypt.encrypt(str);
}

export default {
  data() {
    return {
      isShowDialog: false,
      isLogin: false,
      isCommiting: false,
      acc: "",
      nick: "",
      pwd: "",
      pwd2: ""
    };
  },
  methods: {
    showLogin() {
      this.isShowDialog = true;
      this.isLogin = true;
    },
    showRegister() {
      this.isShowDialog = true;
      this.isLogin = false;
    },
    forget() {
      this.$message("请联系管理员");
    },
    commit() {
      if (this.isLogin) this.login();
      else this.register();
    },
    login() {
      if (!check(this, this.acc, "aa", this.pwd, this.pwd)) return;
      let pwd = bcrypt(this.acc, this.pwd);
      this.$axios({
        url: "/i/login",
        data: {
          acc: this.acc,
          pwd: pwd
        },
        before: () => {
          this.isCommiting = true;
        }
      })
        .then(response => {
          this.handLogin(response.data);
        })
        .catch(error => {
          this.$message(error.msg);
        })
        .finally(() => {
          this.isCommiting = false;
        });
    },
    register() {
      var nick = this.nick.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
      if (!check(this, this.acc, nick, this.pwd, this.pwd2)) return;
      let pwd = rsaEncrypt(this.pwd);
      this.$axios({
        url: "/i/register",
        data: {
          acc: this.acc,
          pwd: pwd,
          nick: nick
        },
        before: () => {
          this.isCommiting = true;
        }
      })
        .then(response => {
          this.handLogin(response.data);
        })
        .catch(error => {
          this.$message(error.msg);
        })
        .finally(() => {
          this.isCommiting = false;
        });
    },
    handLogin(data) {
      if (1 == data.state) {
        this.$store.commit("eventLogin/mLogin", data.data);
        this.isShowDialog = false;
        this.closeDialog();
      } else if (typeof data.info != "undefined") {
        this.$message(data.info);
      }
    },
    closeDialog() {
      this.acc = this.nick = this.pwd = this.pwd2 = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";

.login-dialog {
  .el-input {
    margin-bottom: 6px;
  }

  .login-fun {
    margin: 12px 0 0;

    .forget {
      float: right;
    }

    .dis-click {
      pointer-events: none;
    }
  }
}
</style>
