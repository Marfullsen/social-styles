import { createRouter, createWebHistory } from "vue-router";
import WelcomePage from "../pages/WelcomePage.vue";
import AboutPage from "../pages/AboutPage.vue";
import ScorePage from "../pages/ScorePage.vue";

const routes = [
  {
    path: "/",
    name: "WelcomePage",
    component: WelcomePage,
  },
  {
    path: "/about",
    name: "AboutPage",
    component: AboutPage,
  },
  {
    path: "/score",
    name: "ScorePage",
    component: ScorePage,
  },
  {
    path: '/:pathMatch(.*)*',
    component: WelcomePage,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
