<template>
  <div class="content">
    <el-upload
      class="content-upload"
      :action="`${$axios.defaults.baseURL}/i/file/upload`"
      multiple
      :data="{ path: this.path }"
      :with-credentials="true"
      :on-success="handleUploadSuc"
      :on-error="handleUploadErr"
    >
      <el-button type="text" style="padding:9px 12px;">点击上传</el-button>
    </el-upload>
    <div style="height: 1px; width: 100%; background-color: #ccc;" />
    <div class="content-title">
      <el-breadcrumb separator="/" style="padding: 0px 9px;">
        <el-breadcrumb-item v-for="data in pathList" :key="data.path">
          <a
            v-if="data.path != ''"
            :href="'/file?path=' + data.path"
            @click.prevent="folder"
            :data-path="data.path"
            >{{ data.name }}</a
          >
          <template v-else>{{ data.name }}</template>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span
        class="dir-ctrl"
        style="color: rgb(144, 144, 144);"
        @click="delDir"
        v-if="!dataList.length && pathList.length > 1"
        >删除</span
      >
      <span class="dir-ctrl" @click="requestData">刷新</span>
      <span style="flex: 1;" />
      <span class="dir-ctrl" @click="checkDownloadFile">检测下载</span>
      <span class="dir-ctrl" @click="downloadFile">下载网络文件</span>
      <span class="dir-ctrl" @click="createDir">创建文件夹</span>
    </div>
    <div style="height: 1px; width: 100%; background-color: #ccc;" />
    <ul class="file">
      <li
        v-for="data in dataList"
        :key="data.name"
        :set="(fullPath = `${path}/${data.name}`)"
      >
        <a
          v-if="data.dir"
          class="file-folder flex-center"
          :href="`/file?path=${fullPath}`"
          :data-path="fullPath"
          @click.prevent="folder"
        >
          <i class="ion-icon el-icon-folder"></i>
          <span class="file-text file-text-folder" v-text="data.name" />
        </a>
        <div v-if="!data.dir" class="flex-center">
          <i class="ion-icon el-icon-document"></i>
          <span class="file-text file-text-file" v-text="data.name" />
        </div>
        <div v-if="!data.dir" class="flex-center file-ctrl">
          <a
            class="file-open ml12"
            :href="handleOpenUrl(fullPath)"
            target="_blank"
            >打开</a
          >
          <a
            class="file-download ml24"
            :href="
              `${$axios.defaults.baseURL}/i/file/download?path=${fullPath}`
            "
            >下载</a
          >
          <a
            class="file-download ml24"
            :href="handleShareUrl(fullPath, data.md5)"
            target="_blank"
            >分享</a
          >
          <span class="file-delete ml24" :data-path="fullPath" @click="delFile"
            >删除</span
          >
          <span class="file-date ml24" v-text="handleTime(data.time)" />
          <span class="file-info ml24" v-text="data.info" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
function pd(name, path) {
  return { name: name, path: path };
}

export default {
  data() {
    return {
      path: "",
      pathList: [],
      dataList: []
    };
  },
  // computed: {
  //   dInfo() {
  //     return this.$store.state.eventLogin.dInfo;
  //   }
  // },
  // watch: {
  //   dInfo: {
  //     handler: function(val) {
  //       if (!val.auth || val.auth < 5) {
  //         this.$router.push({ name: "Blog" });
  //       }
  //     },
  //     immediate: true
  //   }
  // },
  created: function() {
    const dInfo = this.$store.state.eventLogin.dInfo;
    if (!dInfo.auth || dInfo.auth < 5) {
      this.$router.push({ name: "Blog" });
      return;
    }
    this.$store.watch(
      () => {
        return this.$store.state.eventLogin.dInfo;
      },
      val => {
        if (!val.auth || val.auth < 5) {
          this.$router.push({ name: "Blog" });
        }
      }
    );
    this.path = this.$route.query.path;
    if (typeof this.path != "string" || this.path == "") {
      this.path = "";
    } else if (!this.path.startsWith("/")) {
      this.path = "/" + this.path;
    }
    this.handlePath();
  },
  methods: {
    handlePath() {
      let ss = this.path.split("/");
      let start = "";
      this.pathList = [pd("全部文件", "/")];
      for (const s of ss) {
        if (s != "") {
          start = start + "/" + s;
          this.pathList.push(pd(s, start));
        }
      }
      this.path = start;
      this.pathList[this.pathList.length - 1].path = "";
      if (this.$route.query.path != this.path) {
        if (this.path != "") {
          this.$router.replace({ query: { path: this.path }, silent: false });
        } else if (typeof this.$route.query.path == "string") {
          this.$router.replace({ query: {}, silent: false });
        }
      }
      this.requestData();
    },
    requestData() {
      this.$axios({
        url: "/i/file/query",
        data: {
          path: this.path
        }
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.dataList = data.data;
          } else if (data.info) {
            this.dataList = [];
            this.$util.err(data.info);
          }
        })
        .catch(error => {
          this.dataList = [];
          this.$util.err(error.msg);
        });
    },
    folder(e) {
      this.path = e.currentTarget.getAttribute("data-path");
      this.handlePath();
    },
    handleTime(time) {
      return this.$util.showTime(this.sysTime, time);
    },
    delFile(e) {
      const fullPath = e.currentTarget.getAttribute("data-path");
      this.$confirm("确定要删除" + fullPath + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          url: "/i/file/delete",
          data: {
            path: this.fullPath
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
    delDir() {
      this.$confirm("确定要删除目录:" + this.path + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          url: "/i/file/deleteDir",
          data: {
            path: this.path
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$util.msg("删除成功");
              this.path = this.pathList[this.pathList.length - 2].path;
              this.handlePath();
            } else if (data.info) {
              this.$util.err(data.info);
            }
          })
          .catch(error => {
            this.$util.err(error.msg);
          });
      });
    },
    createDir() {
      var word = prompt("输入文件夹名称");
      if (word && "" != word) {
        this.$axios({
          url: "/i/file/createDir",
          data: {
            path: this.path,
            dirName: word
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$util.msg("创建成功");
              this.requestData();
            } else if (data.info) {
              this.$util.err(data.info);
            }
          })
          .catch(error => {
            this.$util.err(error.msg);
          });
      }
    },
    downloadFile() {
      var word = prompt("输入下载地址");
      if (word && "" != word) {
        this.$axios({
          url: "/i/file/downloadFile",
          data: {
            path: this.path,
            downloadUrl: word
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$util.suc(data.info);
              this.requestData();
            } else if (data.state == 2) {
              this.$util.msg(data.info);
            } else if (data.info) {
              this.$util.err(data.info);
            }
          })
          .catch(error => {
            this.$util.err(error.msg);
          });
      }
    },
    checkDownloadFile() {
      this.$axios({
        url: "/i/file/checkDownloadFile",
        method: "get"
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.$util.suc(data.info);
          } else if (data.info) {
            this.$util.err(data.info);
          }
        })
        .catch(error => {
          this.$util.err(error.msg);
        });
    },
    handleOpenUrl(fullPath) {
      if (fullPath.substr(-4, 4).toLowerCase() == ".mp4") {
        return `/open/video?path=${fullPath}`;
      } else {
        return `${this.$axios.defaults.baseURL}/i/file/open?path=${fullPath}`;
      }
    },
    handleShareUrl(fullPath, md5) {
      return `${this.$axios.defaults.baseURL}/i/file/open?path=/${md5}${fullPath}`;
    },
    handleUploadSuc(response) {
      if (1 == response.state) {
        this.$util.suc(response.data);
      } else if (response.data) {
        this.$util.err(response.data);
      }
      this.requestData();
    },
    handleUploadErr(err, file) {
      this.$util.err(`上传失败：${file.name}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";

::v-deep {
  .el-upload-list__item {
    margin-top: 0;
  }
}

.content {
  display: block;
  padding-top: $title-height;
  width: 100%;
  height: 100%;

  .content-upload {
    width: 360px;
    max-width: 80%;
  }

  .content-title {
    display: flex;
    height: 40px;
    align-items: center;

    .dir-ctrl {
      padding: 0px 8px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #2d64b3;
    }
    .dir-ctrl:hover {
      background: #f7f7f7;
      cursor: pointer;
    }
  }
}

.el-breadcrumb {
  font-size: 16px;

  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    font-weight: 600;
  }
}

.file {
  .ion-icon {
    font-size: 16px;
    width: 20px;
    margin-left: 12px;
    padding: 5px 0px;
    color: #333;
  }
  .file-folder:hover {
    background: #f7f7f7;
    cursor: pointer;
  }
  .file-text {
    padding: 0 6px;
    font-size: 15px;
  }
  .file-text-folder {
    color: #50beff;
  }
  .file-text-file {
    color: #333;
  }
  .file-ctrl {
    height: 24px;
  }
  .file-open,
  .file-download,
  .file-delete,
  .file-apk {
    font-size: 12px;
    cursor: pointer;
  }
  .file-open,
  .file-download,
  .file-apk {
    color: #2d64b3;
  }
  .file-delete {
    color: #909090;
  }
  .file-date,
  .file-info {
    font-size: 12px;
    color: #333;
  }
}
</style>
