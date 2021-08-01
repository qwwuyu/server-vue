<template>
  <div>
    <div class="header">
      <div class="header-mask-bg" :style="cssProps"></div>
      <div class="header-content">
        <span class="header-log" data-unselectable="我就打打酱油..."></span>
        <div v-if="$store.getters['eventLogin/getLogin']" style="float: right;">
          <el-dropdown @command="handleCommand" placement="bottom">
            <span
              class="header-info"
              v-text="$store.state.eventLogin.dInfo.nick"
            />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="file" v-if="isShowFile()"
                >文件管理器</el-dropdown-item
              >
              <el-dropdown-item command="blog" v-if="isShowBLog()"
                >Blog</el-dropdown-item
              >
              <el-dropdown-item command="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <login-dialog ref="login"></login-dialog>
  </div>
</template>

<script>
import LoginDialog from "@/components/LoginDialog.vue";

export default {
  name: "Title",
  data() {
    return {
      cssProps: {
        backgroundImage: `url(${require("@/assets/img/head_bg.png")})`
      }
    };
  },
  components: {
    "login-dialog": LoginDialog
  },
  methods: {
    showLogin() {
      this.$refs.login.showLogin();
    },
    showRegister() {
      this.$refs.login.showRegister();
    },
    handleCommand(command) {
      if ("logout" == command) {
        this.$store.commit("eventLogin/mLogout");
      } else if ("file" == command) {
        this.$router.push({ name: "File" });
      } else if ("blog" == command) {
        this.$router.push({ name: "Blog" });
      }
    },
    isShowFile() {
      return (
        this.$route.name != "File" &&
        this.$store.state.eventLogin.dInfo.auth >= 5
      );
    },
    isShowBLog() {
      return (
        this.$route.name == "File" &&
        this.$store.state.eventLogin.dInfo.auth >= 5
      );
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

.header-info {
  height: $title-height;
  line-height: $title-height;
  cursor: pointer;
  color: #fff;
  padding: 0 12px;
  max-width: 100px;
  display: block;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.header-info:hover {
  background-color: rgba(255, 255, 255, 0.24);
}

.el-dropdown-menu {
  padding: 0px;
  margin-top: 2px;

  .el-dropdown-menu__item {
    padding: 0 24px;
  }
  /deep/ .popper__arrow {
    border-bottom-color: #1ebef4 !important;
    left: 50% !important;
    visibility: hidden;
  }
}
</style>
