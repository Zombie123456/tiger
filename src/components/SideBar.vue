<template>
  <div wrap v-if="showNav">
    <v-app-bar app clipped-left right color="blue lighten-3">
      <v-col cols="10" class="d-flex align-self-center  justify-center">
        <span class="subtitle mr-2">
          <v-icon>{{ $route.meta.icon }}</v-icon>
        </span>
        {{ $route.meta.title }}
      </v-col>
      <v-col cols="2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-col>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
      right
    >
      <v-list dense class="grey lighten-4">
        <template align-center justify-center>
          <v-row justify="space-around">
            <v-avatar color="indigo">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-row>
          <v-layout justify-center mb5>
            <small>{{ username }}</small>
          </v-layout>
          <v-spacer></v-spacer>
          <v-layout justify-start>
            <v-list-item link to="/change_password">
              <v-list-item-action>
                <v-icon>vpn_key</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="grey--text">
                  更改密码
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-layout>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
        </template>
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          ></v-divider>
          <v-list-item :key="i" link :to="item.path">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <template v-slot:append>
        <div class="pb-10 pl-2 pr-2">
          <v-btn dark block @click="logout()">
            <v-icon>power_settings_new</v-icon>
            <span class="ml-1">{{ $t("actions.logout") }}</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import api from "@/api/apis";
import axios from "axios";
export default {
  name: "SideBar",
  props: {
    showNav: {
      default: true,
    },
    username: {
      default: "",
    },
  },
  data() {
    return {
      drawer: null,
      items: [
        {
          icon: "apps",
          text: "可售房源",
          path: "/apps",
          show: true,
        },
        {
          icon: "people",
          text: "我的售房",
          path: "/sold",
          show: true,
        },
        {
          icon: "apps",
          text: "可售车位",
          path: "/cars",
          show: true,
        },
        {
          icon: "people",
          text: "我售车位",
          path: "/carsale",
          show: true,
        },
      ],
    };
  },
  methods: {
    logout() {
      axios.post(api.logout).then(
        () => {
          this.$router.push("/login");
          this.$cookie.delete("access_token");
          this.$cookie.delete("refresh_token");
          this.$cookie.delete("user_type");
          this.$cookie.delete("username");
        },
        (error) => {
          this.loading = false;
          this.errorMsg = error;
        }
      );
    },
  },
};
</script>
