import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: "login",
      path: "/login",
      component: function(resolve) {
        require(["./views/Login.vue"], resolve);
      },
      meta: {
        title: "登录",
      },
    },
    {
      path: "/",
      name: "Apps",
      component: function(resolve) {
        require(["./views/Main/Apps.vue"], resolve);
      },
      meta: {
        title: "可售房源",
      },
    },
  ],
});
