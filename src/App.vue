<template>
  <div>
    <div style="position: fixed; width: 100%; height: 100%; background-color: rgba(0, 0, 0, .05); z-index: -1000;"></div>
    <title-vue></title-vue>
    <div style="position: fixed; width: 100%; pointer-events:none;">
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="4" style="pointer-events:auto;">
            <div>
              <div>
                <router-link :to="{name:'Card'}">Card</router-link>
              </div>
              <div>
                <router-link :to="{name:'Flag'}">Flag</router-link>
              </div>
              <div>
                <router-link :to="{name:'Note'}">Note</router-link>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content" style="pointer-events:none;">
      <el-row :gutter="20">
        <el-col :offset="4" :span="20" style="pointer-events:auto;">
          <router-view />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "App"
}
</script>

<style lang="scss">
* {
  padding: 0px;
  margin: 0px;
}
.content {
  padding-top: 64px;
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
}
</style>
