<template>
  <v-app id="app">
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import $ from "./utils/util";
import api from "@/api/apis";
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      username: "",
    };
  },
  watch: {
    username(newObj) {
      console.log(window.document.cookie);
      window.document.cookie = `username=${newObj}`;
    },
  },
  components: {},
  computed: {
    showNav() {
      return this.$route.name !== "login";
    },
  },
  created() {
    // this.getMy();
  },
  methods: {
    setUpRouterHooks() {
      this.$router.beforeEach((to, from, next) => {
        this.routerLoading = true;
        this.authErrors = [];
        next();
      });
      this.$router.afterEach(() => {
        this.routerLoading = false;
      });
    },
    setUpAuth() {
      let refreshTokenInterval;
      // refresh access token every 5 mins
      $.setIndicator(
        () => {
          refreshTokenInterval = window.setInterval(() => {
            this.refresh();
          }, 300000);
        },
        () => {
          window.clearInterval(refreshTokenInterval);
        }
      );
    },
    getMy() {
      console.log("我的");

      if (!this.$cookie.get("access_token")) {
        return;
      }
      console.log("进来了");
      axios.get(api.my).then((response) => {
        console.log(response);
        console.log(response.data);
        console.log(response.data.data);
        this.username = response.data.data.username;
        console.log(response.data.data.role);
        console.log(this.$store.store);
        let save = response.data.data;
        this.$store.dispatch("saveRole", save);
        this.setUpAuth();
        this.setUpRouterHooks();
      });
    },
    refresh() {
      console.log("刷新");
      let refreshToken = this.$cookie.get("refresh_token");
      if (!refreshToken) {
        return;
      }
      axios
        .post(api.refresh_token, {
          refresh_token: this.$cookie.get("refresh_token"),
        })
        .then((data) => {
          let d = new Date(data.expires_in);
          // use access_token to access APIs
          window.document.cookie =
            "access_token=" +
            data.access_token +
            ";path=/;expires=" +
            d.toGMTString();
          // use refresh_token to fetch new access_token
          window.document.cookie =
            "refresh_token=" +
            data.refresh_token +
            ";path=/;expires=" +
            d.toGMTString();
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.access_token;
        });
    },
  },
};
</script>

<style>
.row {
  margin: 0;
}
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
