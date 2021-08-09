<template>
  <div style="width: 800px; margin: 0 auto;">
    <video
      id="myVideo"
      class="video-js vjs-paused vjs_video_3-dimensions vjs-controls-enabled vjs-workinghover vjs-v7 vjs-user-active"
      width="800"
      height="600"
      controls
    >
      <source
        type="video/mp4"
        src="http://localhost:8080/ad/file/download?path=/test/test.mp4"
      />
    </video>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import video from "video.js";
import videoZH from "video.js/dist/lang/zh-CN.json";
video.addLanguage("zh-CN", videoZH);
export default {
  name: "TestTwo",
  data() {
    return {};
  },
  mounted() {
    this.initVideo();
  },
  methods: {
    initVideo() {
      //初始化视频方法
      /* eslint-disable */
      let myPlayer = video(myVideo, {
        //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: true,
        //自动播放属性,muted:静音播放
        autoplay: "muted",
        //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: "auto",
        language: "zh-CN"
      });
    }
  }
};
</script>