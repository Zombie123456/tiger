import Vue from "vue";
import Vuex from "vuex";

//挂载Vuex
Vue.use(Vuex);

//创建VueX对象
const store = new Vuex.Store({
  state: {
    role: "",
  },
  mutations: {
    SET_ROLE(state, body) {
      console.log("body");
      console.log("body");
      console.log("body");
      console.log(body);
      state.role = body;
    },
  },
  actions: {
    saveRole({ commit }, role) {
      commit("SET_ROLE", role);
    },
  },
});
// const mutations = {
//   SET_ROLE(state, body) {
//     state.role = body;
//   },
// };
// const actions = {
//   saveRole({ commit }, role) {
//     commit("SET_ROLE", role);
//   },
// };
export default store;
