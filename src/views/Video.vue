<template>
  <div style="width: 800px; margin: 8px auto;">
    <video
      ref="video"
      class="video-js vjs-paused vjs_video_3-dimensions vjs-controls-enabled vjs-workinghover vjs-v7 vjs-user-active"
      width="800"
      height="600"
      controls
    >
      <source ref="source" :src="src" />
      <!-- src="http://localhost:8080/ad/file/download?path=/files/test.mp4" -->
    </video>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import video from "video.js";
import videoZH from "video.js/dist/lang/zh-CN.json";
video.addLanguage("zh-CN", videoZH);
export default {
  data() {
    return {
      src: `${this.$axios.defaults.baseURL}ad/file/download?path=${this.$route.query.path}`
    };
  },
  mounted() {
    const path = this.$route.query.path;
    if (typeof path == "string" && path != "") {
      this.myPlayer = video(this.$refs.video, {
        controls: true,
        autoplay: false,
        preload: "auto",
        language: "zh-CN"
      });
    } else {
      this.$util.err("视频地址不正确");
    }
  },
  beforeDestroy() {
    if (this.myPlayer) {
      this.myPlayer.dispose();
    }
  }
};
</script>
