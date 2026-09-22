import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    nowPage: 5,
    isLogin: false,
    userInfo: {},
    ArticleIsAll: true,
    tags: [
      {
        index: "1",
        value: "html",
      },
      {
        index: "2",
        value: "css",
      },
      {
        index: "3",
        value: "javaScript",
      },
      {
        index: "4",
        value: "Vue",
      },
      {
        index: "5",
        value: "react",
      },
      {
        index: "6",
        value: "node.js",
      },
      {
        index: "7",
        value: "es6",
      },
    ],
    articles: [],
    messages: [],
    searchArticles: [],
  },
  mutations: {
    ctrlIndex(state, index) {
      state.nowPage = index;
      // console.log(state.nowPage);
    },
    isLogin(state, sel) {
      state.isLogin = sel;
    },
    getUserInfo(state, data) {
      state.userInfo = data;
    },
    toSearch(state,data) {
      state.ArticleIsAll = data;
    },
    getAllArticle(state, data) {
      state.articles = Array.isArray(data) ? [...data].reverse() : [];
    },
    getAllMessage(state, data) {
      state.messages = Array.isArray(data) ? [...data].reverse() : [];
    },
    addMessage(state, data) {
      state.messages.unshift(data);
    },
    addArticle(state, data) {
      state.searchArticles.unshift(data);
    },
    searchArticles(state, data) {
      state.searchArticles = Array.isArray(data) ? [...data].reverse() : [];
    },
  },
  actions: {},
  getters: {},
});
