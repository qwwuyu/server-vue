<template>
  <div>
    <div
      style="position: fixed; width: 100%; height: 100%; background-color: #F2F2F2; z-index: -1000;"
    ></div>
    <div style="position: fixed; width: 100%;">
      <div class="content">
        <el-row :gutter="0">
          <el-col :span="4" style="pointer-events:auto;">
            <el-menu
              :default-active="$route.name"
              :collapse="isMobile"
              background-color="#00000000"
              text-color="#909090"
              active-text-color="#007fff"
              style="border-right: 0px; margin-right: 20px;"
              @select="handleSelect"
            >
              <el-menu-item
                v-for="menu in menus"
                :index="menu.index"
                :key="menu.index"
                style="padding: 0px;"
              >
                <div class="menu-item-div">
                  <i :class="menu.icon" />
                  <span slot="title">{{ menu.index }}</span>
                </div>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="0">
        <el-col :offset="4" :span="20" style="pointer-events:auto;">
          <router-view />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMobile: this._isMobile(),
      menus: [
        { index: "Card", icon: "el-icon-edit-outline" },
        { index: "Flag", icon: "el-icon-s-flag" },
        { index: "Note", icon: "el-icon-notebook-1" }
      ]
    };
  },
  methods: {
    handleSelect(key) {
      if (this.$route.name != key) {
        this.$router.push({ name: key });
      }
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        // eslint-disable-next-line max-len
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag != null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";
.content {
  padding-top: $title-height + 16px;
  max-width: $content-width;
  width: 100%;
  margin: 0 auto;
  pointer-events: none;
}

.el-menu,
.is-active > .menu-item-div {
  background-color: #ebebeb;
}

.menu-item-div:hover {
  background-color: #ebebeb;
}

.menu-item-div {
  background-color: #f2f2f2;
  padding-left: 20px;

  span {
    margin-left: 6px;
  }
}
</style>
