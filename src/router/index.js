import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/components/Layout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/404",
    name: "notFound",
    meta: { title: "页面找不到" },
    component: () => import("../views/404.vue"),
    hidden: true
  },
  {
    path: "/",
    redirect: {
      name: "Blog"
    }
  },
  {
    path: "/blog",
    name: "Blog",
    redirect: {
      name: "Card"
    },
    component: Layout,
    children: [
      {
        path: "card",
        name: "Card",
        meta: { title: "Card" },
        component: () => import("../views/Card.vue")
      },
      {
        path: "flag",
        name: "Flag",
        meta: { title: "Flag" },
        component: () => import("../views/Flag.vue")
      },
      {
        path: "note",
        name: "Note",
        meta: { title: "Note" },
        component: () => import("../views/Note.vue")
      }
    ]
  },
  {
    path: "*",
    redirect: {
      name: "notFound"
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// 导航守卫
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
