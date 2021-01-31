import Vue from "vue";
import VueRouter from "vue-router";
import Card from "../views/Card.vue";

Vue.use(VueRouter);

const routes = [{
    path: '/',
    redirect: {
      name: 'Card'
    }
  },
  {
    name: "Card",
    path: "/card",
    component: Card
  },
  {
    name: "Flag",
    path: "/flag",
    component: () => import("../views/Flag.vue")
  },
  {
    name: "Note",
    path: "/note",
    component: () => import("../views/Note.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;