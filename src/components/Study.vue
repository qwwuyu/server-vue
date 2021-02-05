<template>
  <div></div>
</template>

<script>
import Test from "@/components/Title.vue";
export default {
  components: {},
  data() {
    return {
      cssProps: {
        backgroundImage: `url(${require("@/assets/img/head_bg.png")})`
      }
    };
  },
  created() {
    this.$axios
      .get("http://localhost:8080/test/get")
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>

<style></style>
