<template>
  <div class="header">
    <div>
      <a href="/card">Card</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Title",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";
.header {
  position: fixed;
  width: 100%;
  height: $title-height;
  background-color: #fff;
  z-index: 100;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  div {
    position: relative;
    max-width: $content-width;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
