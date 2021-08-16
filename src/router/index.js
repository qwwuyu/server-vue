import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/components/Layout.vue";
var qs = require("qs");

Vue.use(VueRouter);

const routes = [
  {
    path: "/404",
    name: "notFound",
    meta: { title: "页面找不到" },
    component: () => import("../views/404.vue")
  },
  {
    path: "/500",
    name: "serverError",
    meta: { title: "服务器未知错误" },
    component: () => import("../views/500.vue")
  },
  {
    path: "/open/video",
    name: "video",
    meta: { title: "video" },
    component: () => import("../views/Video.vue"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: {
      name: "Card"
    },
    children: [
      {
        path: "file",
        name: "File",
        meta: { title: "File" },
        component: () => import("../views/File.vue")
      },
      {
        path: "/code/java",
        name: "Java",
        meta: { title: "java" },
        component: () => import("../views/code/Java.vue"),
        hidden: true
      },
      {
        path: "/blog",
        name: "Blog",
        component: () => import("../components/Blog.vue"),
        redirect: {
          name: "Card"
        },
        children: [
          {
            path: "card",
            name: "Card",
            meta: { title: "Card" },
            component: () => import("../views/blog/Card.vue")
          },
          {
            path: "flag",
            name: "Flag",
            meta: { title: "Flag" },
            component: () => import("../views/blog/Flag.vue")
          },
          {
            path: "note",
            name: "Note",
            meta: { title: "Note" },
            component: () => import("../views/blog/Note.vue")
          }
        ]
      }
    ]
  },
  {
    path: "*",
    meta: { title: "页面找不到" },
    component: () => import("../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  stringifyQuery: query => {
    let result = qs.stringify(query, { format: "RFC1738" });
    return result ? "?" + unescape(result) : "";
  },
  routes
});

// 导航守卫
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
