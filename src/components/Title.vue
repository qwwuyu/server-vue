<template>
  <div class="header">
    <div class="header-mask-wrp">
      <div
        class="header-mask-bg"
        :style="cssProps"
      >
      </div>
      <div class="header-mask">
        <a href="/card">Card</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Title",
  data () {
    return {
      cssProps: {
        backgroundImage: `url(${require('@/assets/img/head_bg.png')})`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
//导入
@import "./src/assets/css/base.scss";
.header {
  position: fixed;
  width: 100%;
  height: 42px;
  color: #fff;
  font-size: 13px;
  z-index: 100;
}

.header-mask-wrp {
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 2px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -100;
}

.header-mask-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center 0 !important;
  z-index: -100;
}

.header-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: -50;
}
</style>