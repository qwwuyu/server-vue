<template>
  <div class="content">
    <span>File</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created: function() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";
.content {
  padding-top: $title-height + 16px;
  width: 100%;
  pointer-events: none;
}
</style>
