import Vue from "vue";
import Router from "vue-router";
import HomePage from "./views/HomePage.vue";
import DiscoverPage from "./views/DiscoverPage.vue";
import RecipePage from "./views/RecipePage.vue";
import LoginPage from "./views/LoginPage.vue";
import About from "./views/About.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/discover",
    },
    {
      path: "/home",
      name: "home",
      component: HomePage,
    },
    {
      path: "/discover",
      name: "discover",
      component: DiscoverPage,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: About,
      // component: () => {}
      //   import(/* webpackChunkName: "about" */ "./views/About.vue"),
    },
    { path: "/recipe/:id", component: RecipePage },
    { path: "/login", component: LoginPage },
  ],
});
