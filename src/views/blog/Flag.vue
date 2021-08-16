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
        <span
          class="page-send"
          @click="showPublish"
          v-if="this.$store.state.eventLogin.dInfo.auth >= 5"
          >发布</span
        >
      </div>
      <div class="main-content">
        <ul>
          <li class="content-item" v-for="data in datas" :key="data.id">
            <span class="content-title" v-text="data.title" />
            <div class="content-info">
              <span class="info-text" v-text="data.nick" />
              <span class="info-text" v-text="handleTime(data.time)" />
            </div>
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
        url: "/i/blog/flag/get",
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
          } else if (data.info) {
            this.$util.err(data.info);
          }
        })
        .catch(error => {
          this.$util.err(error.msg);
        });
    },
    showPublish() {
      if (this.$store.getters["eventLogin/getLogin"]) {
        this.$refs.publish.show();
      } else {
        this.$util.msg("请先登录");
      }
    },
    publish(title) {
      if (
        !new RegExp(".{1,50}").test(title) ||
        !new RegExp(".*[\\S]+.*").test(title)
      ) {
        this.$util.msg("内容不能为空");
        return;
      }
      this.$axios({
        url: "/i/blog/flag/send",
        data: {
          title: title
        },
        before: () => {
          this.$refs.publish.commiting();
        }
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.$util.msg("发布成功");
            this.$refs.publish.close();
            this.requestData();
          } else if (data.info) {
            this.$util.err(data.info);
          }
        })
        .catch(error => {
          this.$util.err(error.msg);
        })
        .finally(() => {
          this.$refs.publish.disCommit();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/blog.scss";
</style>
