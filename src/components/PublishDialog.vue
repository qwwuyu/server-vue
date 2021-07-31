<template>
  <div>
    <el-dialog
      class="publish-dialog"
      v-if="isShowDialog"
      :visible.sync="isShowDialog"
      :title="hint"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="close"
    >
      <div
        v-loading="isCommiting"
        element-loading-text="提交中..."
        style="padding: 10px 20px;"
      >
        <el-input
          type="textarea"
          :rows="3"
          maxlength="50"
          placeholder="请输入内容"
          v-model="dTitle"
        ></el-input>
        <el-input
          class="publish-content"
          v-if="isContent"
          type="textarea"
          :rows="4"
          maxlength="500"
          placeholder="请输入详情"
          v-model="dContent"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false" :disabled="isCommiting"
          >取 消</el-button
        >
        <el-button type="primary" @click="commit" :disabled="isCommiting"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["hint", "isContent", "call"],
  data() {
    return {
      isShowDialog: false,
      isCommiting: false,
      dTitle: "",
      dContent: ""
    };
  },
  methods: {
    show() {
      this.isShowDialog = true;
    },
    commit() {
      this.call(this.dTitle, this.dContent);
    },
    commiting() {
      this.isCommiting = true;
    },
    disCommit() {
      this.isCommiting = false;
    },
    close() {
      this.isShowDialog = false;
      this.dTitle = "";
      this.dContent = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/base.scss";
.publish-content {
  margin-top: 20px;
}

::v-deep {
  .publish-dialog > .el-dialog {
    width: 80%;
    max-width: 640px;

    .el-dialog__header {
      padding: 20px 20px 10px 20px;
    }
    .el-dialog__body {
      padding: 0px;
    }
    .el-el-dialog__footer {
      padding: 10px 20px;
    }
  }
}
</style>
