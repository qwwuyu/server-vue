<template>

</template>

<script>
// import Test from "@/components/Title.vue";
export default {
  components: {
  },
  created () {
    this.$axios.get('http://localhost:8080/test/get')
      .then(res => {
        console.log(res)
      }).catch(e => {
        console.log(e)
      })
  }
}
</script>

<style>
</style>