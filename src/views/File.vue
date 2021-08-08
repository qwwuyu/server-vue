<template>
  <div class="content">
    <el-button
      type="text"
      style="padding:9px 12px;"
      @click="$refs.fileInput.click()"
      >点击上传</el-button
    >
    <input
      @change="selectFile"
      ref="fileInput"
      type="file"
      multiple="multiple"
      style="display: none;"
    />
    <div style="height: 1px; width: 100%; background-color: #ccc;" />
    <div class="content-title">
      <el-breadcrumb separator="/" style="padding: 0px 9px;">
        <el-breadcrumb-item v-for="data in pathList" :key="data.path">
          <a
            v-if="data.path != ''"
            :href="'/file?path=' + data.path"
            @click.prevent="folder"
            :data="data.path"
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
        :set="(fullPath = path + '/' + data.name)"
      >
        <a
          v-if="data.dir"
          class="file-folder flex-center"
          :href="'/file?path=' + fullPath"
          :data="fullPath"
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
            :href="'/ad/file/open?path=' + fullPath"
            target="_blank"
            >打开</a
          >
          <a
            class="file-download ml24"
            :href="'/ad/file/download?path=' + fullPath"
            >下载</a
          >
          <span class="file-delete ml24" @click="del(fullPath)">删除</span>
          <span class="file-date ml24" v-text="data.date" />
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
  created: function() {
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
        url: "/ad/file/query",
        data: {
          token: this.$store.state.eventLogin.dToken,
          path: this.path
        }
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.dataList = data.data;
          } else if (typeof data.info != "undefined") {
            this.$message(data.info);
          }
        })
        .catch(error => {
          this.$message(error.msg);
        });
    },
    folder(e) {
      this.path = e.currentTarget.getAttribute("data");
      this.handlePath();
    },
    del(fullPath) {
      this.$confirm("确定要删除" + fullPath + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          url: "/ad/file/delete",
          data: {
            token: this.$store.state.eventLogin.dToken,
            path: this.fullPath
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$message({ message: "删除成功", type: "success" });
              this.requestData();
            } else if (data.info) {
              this.$message(data.info);
            }
          })
          .catch(error => {
            this.$message(error.msg);
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
          url: "/ad/file/deleteDir",
          data: {
            token: this.$store.state.eventLogin.dToken,
            path: this.path
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$message({ message: "删除成功", type: "success" });
              this.path = this.pathList[this.pathList.length - 2].path;
              this.handlePath();
            } else if (data.info) {
              this.$message(data.info);
            }
          })
          .catch(error => {
            this.$message(error.msg);
          });
      });
    },
    createDir() {
      var word = prompt("输入文件夹名称");
      if (word && "" != word) {
        this.$axios({
          url: "/ad/file/createDir",
          data: {
            token: this.$store.state.eventLogin.dToken,
            path: this.path,
            dirName: word
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$message({ message: "创建成功", type: "success" });
              this.requestData();
            } else if (typeof data.info != "undefined") {
              this.$message(data.info);
            }
          })
          .catch(error => {
            this.$message(error.msg);
          });
      }
    },
    downloadFile() {
      var word = prompt("输入下载地址");
      if (word && "" != word) {
        this.$axios({
          url: "/ad/file/downloadFile",
          data: {
            token: this.$store.state.eventLogin.dToken,
            path: this.path,
            downloadUrl: word
          }
        })
          .then(response => {
            const data = response.data;
            if (1 == data.state) {
              this.$message({ message: data.info, type: "success" });
              this.requestData();
            } else if (data.state == 2) {
              this.$message({ message: data.info, type: "success" });
            } else if (typeof data.info != "undefined") {
              this.$message(data.info);
            }
          })
          .catch(error => {
            this.$message(error.msg);
          });
      }
    },
    checkDownloadFile() {
      this.$axios({
        url:
          "/ad/file/checkDownloadFile?token=" +
          this.$store.state.eventLogin.dToken,
        method: "get"
      })
        .then(response => {
          const data = response.data;
          if (1 == data.state) {
            this.$message({ message: data.info, type: "success" });
          } else if (typeof data.info != "undefined") {
            this.$message(data.info);
          }
        })
        .catch(error => {
          this.$message(error.msg);
        });
    },
    selectFile() {
      var fileList = this.$refs.fileInput.files;
      console.log(fileList);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";
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
