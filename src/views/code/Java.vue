<template>
  <div class="content">
    <form
      target="_blank"
      accept-charset="UTF-8"
      :action="`${$axios.defaults.baseURL}/i/java/result`"
      method="post"
    >
      <div class="in-coder-panel">
        <textarea ref="textarea" name="code"></textarea>
        <el-select class="code-mode-select" v-model="mode" @change="changeMode">
          <el-option
            v-for="mode in modes"
            :key="mode.value"
            :label="mode.label"
            :value="mode.value"
          ></el-option>
        </el-select>
      </div>
      <div style="width: 100%;">
        <el-button
          class="btn"
          native-type="submit"
          type="primary"
          @click="commit"
          >提交</el-button
        >
      </div>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
// 引入全局实例
import _CodeMirror from "codemirror";
// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/dracula.css";

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
import "codemirror/mode/clike/clike.js";
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/css/css.js'
// import 'codemirror/mode/xml/xml.js'
// import 'codemirror/mode/markdown/markdown.js'
// import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/r/r.js'
// import 'codemirror/mode/shell/shell.js'
// import 'codemirror/mode/sql/sql.js'
// import 'codemirror/mode/swift/swift.js'
// import 'codemirror/mode/vue/vue.js'

// 获取全局实例
const CodeMirror = _CodeMirror;

export default {
  data() {
    return {
      cTime: null,
      code: "", // 内部真实的内容
      mode: "x-java", // 默认的语法类型
      coder: null, // 编辑器实例
      // 默认配置
      options: {
        tabSize: 2, // 缩进格式
        theme: "dracula", // 主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true // 显示行号
      },
      // 支持切换的语法高亮类型，对应 JS 已经提前引入
      modes: [
        {
          value: "x-java",
          label: "Java"
        }
      ]
    };
  },
  mounted() {
    const dInfo = this.$store.state.eventLogin.dInfo;
    if (!dInfo.auth || dInfo.auth < 5) {
      this.$router.push({ name: "Blog" });
      return;
    }
    this._initialize();
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
  },
  methods: {
    _initialize() {
      // 初始化编辑器实例
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
      // 编辑器赋值
      this.coder.setValue(this.code);
      // 支持双向绑定
      this.coder.on("change", coder => {
        this.code = coder.getValue();
      });
    },
    // 更改模式
    changeMode(val) {
      // 修改编辑器的语法配置
      this.coder.setOption("mode", `text/${val}`);
      // 获取修改后的语法
      let label = this._getLanguage(val).label.toLowerCase();
      // 允许父容器通过以下函数监听当前的语法值
      this.$emit("language-change", label);
    },
    _getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find(mode => {
        let currentLanguage = language.toLowerCase();
        let currentLabel = mode.label.toLowerCase();
        let currentValue = mode.value.toLowerCase();
        return (
          currentLabel === currentLanguage || currentValue === currentLanguage
        );
      });
    },
    commit(e) {
      if (this.cTime && Date.now() - this.cTime < 5000) {
        this.$util.msg("五秒内不得连续提交");
        e.preventDefault();
        return;
      } else {
        this.cTime = Date.now();
        e.stopPropagation();
      }
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
}

.btn {
  display: table;
  margin: 9px auto;
  padding: 12px 48px;
}

::v-deep {
  .in-coder-panel {
    flex-grow: 1;
    display: flex;
    position: relative;
  }

  .CodeMirror {
    flex-grow: 1;
    z-index: 1;
    border: 1px solid black;
    font-size: 13px;
  }

  .CodeMirror-code {
    line-height: 19px;
  }

  .code-mode-select {
    position: absolute;
    z-index: 2;
    right: 10px;
    top: 10px;
    max-width: 130px;
  }
}
</style>
