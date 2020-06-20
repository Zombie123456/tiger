import Vue from "vue";
import VueI18n from "vue-i18n";
import Router from "vue-router";
import locales from "./i18n/locales";

Vue.use(Router);
Vue.use(VueI18n);

let navLang = navigator.language || navigator.userLanguage;
if (navLang === "zh-CN" || navLang === "zh-cn") {
  Vue.config.lang = "cn";
} else if (navLang === "en-US" || navLang === "en-us") {
  Vue.config.lang = "en";
} else {
  Vue.config.lang = "cn";
}

const i18n = new VueI18n({
  locale: Vue.config.lang,
  fallbackLocale: "en",
  messages: locales,
});

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
        title: i18n.t("nav.login"),
        auth: false,
      },
    },
    {
      path: "/apps",
      name: "Overview",
      component: function(resolve) {
        require(["./views/Main/Apps.vue"], resolve);
      },
      meta: {
        icon: "apps",
        title: i18n.t("nav.apps"),
      },
    },
    {
      path: "/cars",
      name: "Cars",
      component: function(resolve) {
        require(["./views/Main/Cars.vue"], resolve);
      },
      meta: {
        icon: "apps",
        title: "车位详情",
      },
    },
    {
      path: "/change_password",
      name: "Change Password",
      component: function(resolve) {
        require(["./views/My/ChangePassword.vue"], resolve);
      },
      meta: {
        icon: "vpn_key",
        auth: true,
        title: i18n.t("nav.change_password"),
      },
    },
    {
      path: "/",
      name: "Apps",
      component: function(resolve) {
        require(["./views/Main/Apps.vue"], resolve);
      },
      meta: {
        icon: "apps",
        auth: true,
        title: i18n.t("nav.apps"),
      },
    },
    {
      path: "/staff",
      name: "Staff",
      component: function(resolve) {
        require(["./views/Users/Staff.vue"], resolve);
      },
      meta: {
        icon: "people",
        auth: true,
        title: i18n.t("nav.staff"),
      },
    },
  ],
});
