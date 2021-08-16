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
        <el-collapse accordion>
          <el-collapse-item
            v-for="data in datas"
            :key="data.id"
            style="overflow: hidden;"
          >
            <template slot="title">
              <div class="content-item">
                <span class="content-title" v-text="data.title" />
                <div class="content-info">
                  <span class="info-text" v-text="data.nick" />
                  <span class="info-text" v-text="handleTime(data.time)" />
                  <span
                    class="content-rm"
                    :data-id="data.id"
                    v-if="$store.state.eventLogin.dInfo.id == data.userId"
                    @click.stop="rm"
                    >删除</span
                  >
                </div>
              </div>
            </template>
            <span style="white-space: pre-line" v-text="data.content"></span>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <publish-dialog
      ref="publish"
      hint="发布Note"
      :isContent="true"
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
    rm(e) {
      const id = e.currentTarget.getAttribute("data-id");
      this.$confirm("确定要删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          url: "/i/blog/note/rm",
          data: {
            id: id
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$util.msg("删除成功");
              this.requestData();
            } else if (data.info) {
              this.$util.err(data.info);
            }
          })
          .catch(error => {
            this.$util.err(error.msg);
          });
      });
    },
    requestData() {
      this.$axios({
        url: "/i/blog/note/get",
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
    publish(title, content) {
      if (
        !new RegExp(".{1,50}").test(title) ||
        !new RegExp(".*[\\S]+.*").test(title)
      ) {
        this.$util.msg("内容不能为空");
        return;
      }
      this.$axios({
        url: "/i/blog/note/send",
        data: {
          title: title,
          content: content
        },
        before: () => {
          this.$refs.publish.commiting();
        }
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.$util.suc("发布成功");
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

.content-item {
  height: 49px;
  border-bottom: 0;
}

::v-deep {
  .el-collapse-item__header {
    height: 49px;
    line-height: 49px;
  }

  .el-icon-arrow-right {
    margin: 0 8px 0 0px;
  }

  .el-collapse-item__content {
    padding: 10px 12px;
  }
}
</style>
