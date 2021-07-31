<template>
  <div>
    <div class="content-main">
      <div class="main-page">
        <el-pagination
          layout="prev, pager, next,total"
          @current-change="handleChangePage"
          :current-page.sync="currentPage"
          :total="mCount"
          :page-size="10"
          :small="isSmall"
          :background="isBackground"
          style="padding:0px;"
        ></el-pagination>
        <span class="page-send" @click="showPublish" v-if="isAuth">发布</span>
      </div>
      <div class="main-content">
        <ul>
          <li v-for="data in datas" :key="data.id" style="overflow: hidden;">
            <span class="main-content-title" v-text="data.title" />
            <span class="main-content-info" v-text="data.nick" />
            <span class="main-content-info" v-text="handleTime(data.time)" />
          </li>
        </ul>
      </div>
    </div>
    <publish-dialog
      ref="publish"
      hint="发布Flag"
      :isContent="false"
      :call="publish"
    ></publish-dialog>
  </div>
</template>

<script>
import PublishDialog from "@/components/PublishDialog.vue";

export default {
  data() {
    return {
      isSmall: true,
      isBackground: true,
      isAuth: this.$store.state.eventLogin.dInfo.auth >= 5,
      currentPage: 1,
      mCount: 0,
      sysTime: 1,
      datas: []
    };
  },
  components: {
    "publish-dialog": PublishDialog
  },
  created: function() {
    try {
      this.currentPage = parseInt(this.$route.query.page);
    } catch (err) {
      this.currentPage = 1;
    }
    this.requestData();
  },
  methods: {
    handleChangePage() {
      this.$router.replace({ query: { page: this.currentPage } });
      this.requestData();
    },
    handleTime(time) {
      return this.$util.showTime(this.sysTime, time);
    },
    requestData() {
      this.$axios({
        url: "/i/flag/get",
        data: {
          page: this.currentPage
        }
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.mCount = data.data.count;
            this.sysTime = data.data.sysTime;
            this.datas = data.data.datas;
          } else if (typeof data.info != "undefined") {
            this.$message(data.info);
          }
        })
        .catch(error => {
          this.$message(error.msg);
        });
    },
    showPublish() {
      if (this.$store.getters["eventLogin/getLogin"]) {
        this.$refs.publish.show();
      } else {
        this.$message("请先登录");
      }
    },
    publish(title) {
      if (
        !new RegExp(".{1,50}").test(title) ||
        !new RegExp(".*[\\S]+.*").test(title)
      ) {
        this.$message("内容不能为空");
        return;
      }
      this.$axios({
        url: "/i/flag/send",
        data: {
          token: this.$store.state.eventLogin.dToken,
          title: title
        },
        before: () => {
          this.$refs.publish.commiting();
        }
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.$message({
              message: "发布成功",
              type: "success"
            });
            this.$refs.publish.close();
            this.requestData();
          } else if (typeof data.info != "undefined") {
            this.$message(data.info);
          }
        })
        .catch(error => {
          this.$message(error.msg);
        })
        .finally(() => {
          this.$refs.publish.disCommit();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";
@import "./src/assets/css/blog.scss";
</style>
