const showTime = (sysTime, time) => {
  var now = new Date(sysTime);
  var date = new Date(time);
  var diff = sysTime - time;
  if (diff < 180000) {
    return "刚刚";
  } else if (diff < 3600000) {
    return Math.ceil(diff / 60000) + "分钟前";
  } else if (diff < 86400000) {
    return Math.ceil(diff / 3600000) + "小时前";
  } else if (now.getFullYear() == date.getFullYear()) {
    return date.format("MM-dd hh:mm:ss");
  } else {
    return date.format("yyyy-MM-dd hh:mm:ss");
  }
};
Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[k]
          : ("00" + date[k]).substr(("" + date[k]).length)
      );
    }
  }
  return format;
};

import { Notification } from "element-ui";
import { Message } from "element-ui";
const msg = msg => {
  Message.info({
    message: msg
  });
};
const suc = msg => {
  Notification.success({
    title: msg,
    showClose: false
  });
};
const err = msg => {
  Notification.error({
    title: msg,
    showClose: false,
    position: "top-left"
  });
};

const util = {};
util.showTime = showTime;
util.msg = msg;
util.suc = suc;
util.err = err;

export default util;
