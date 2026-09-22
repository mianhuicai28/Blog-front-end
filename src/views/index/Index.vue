<template>
  <div class="page-layout home-page">
    <!-- 用户信息 -->
    <div class="right-aside">
      <div class="intro">
        <p><span style="color: #edc139">博客</span> - 简介</p>
        <div>
          For - Front End 是基于 Node.js 的前端学习博客系统，采用 Vue + node.js
          + mongoDB 技术栈。
        </div>
        <p><span style="color: #edc139">站长</span> - 介绍</p>
        <div>一枚还算热爱前端的小白。</div>
      </div>

      <div class="calendar">
        <a-calendar
          :fullscreen="false"
          @select="select"
          @change="change"
          @panelChange="onPanelChange"
        />
      </div>
    </div>

    <div class="main">
      <!-- 左导航栏 -->
      <Left-menu></Left-menu>
      <div class="main-show-view" ref="shows">
        <Article-list
          :articles="$store.state.ArticleIsAll ? articles : searchArticles"
          :loading="loading"
        ></Article-list>

        <el-backtop target=".main-show-view" :right="40" :bottom="60">
          <div class="back-top">UP</div>
        </el-backtop>
      </div>
    </div>
  </div>
</template>

<script>
import LeftMenu from "@/components/left-menu/Left-menu.vue";
import ArticleList from "@/components/article-list/article-list.vue";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  data() {
    return {
      page_index: 0,
      value: new Date(),
      loading: false,
    };
  },
  computed: {
    articles() {
      return this.$store.state.articles;
    },
    searchArticles() {
      return this.$store.state.searchArticles;
    },
  },
  methods: {
    async getUserInfo() {
      const { data } = await this.$http.getUserInfo();
      if (data.status === 0) this.$store.commit("getUserInfo", data.data);
    },
    async getAllArticle() {
      this.loading = true;
      try {
        const { data } = await this.$http.getAllArticle();
        const articles = Array.isArray(data.data) ? data.data : [];
        this.$store.commit("searchArticles", articles);
        this.$store.commit("getAllArticle", articles);
      } catch (_) {
        this.$store.commit("searchArticles", []);
        this.$store.commit("getAllArticle", []);
      } finally {
        this.loading = false;
      }
    },
    onPanelChange() {},
    async select(val) {
      this.$store.commit("toSearch", false);
      const query = moment(val).format("YYYY[年]MM[月]DD[日]");
      try {
        const { data } = await this.$http.searchByTime(
          this.$qs.stringify({ time: query })
        );
        this.$store.commit("searchArticles", data.data || []);
      } catch (_) {
        this.$store.commit("searchArticles", []);
      }
    },
    change() {},
  },
  created() {
    this.$store.commit("ctrlIndex", this.page_index);
    this.getAllArticle();
  },
  async activated() {
    this.$store.commit("ctrlIndex", this.page_index);
    this.getAllArticle();
  },

  components: {
    LeftMenu,
    ArticleList,
  },
};
</script>

<style lang="less" scoped>
@import url("ant-design-vue/dist/antd.css");
@import url("@/assets/less/index.less");
.right-aside {
  height: @main-height;
  background: none !important;
  padding: 0;
  .intro {
    .column();
    align-items: flex-start;
    width: 300px;
    height: 259px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    color: #86909c;
    p {
      font-size: 18px;
      line-height: 18px;
      margin-bottom: 20px;
      border-bottom: 1px solid #fff;
    }
    div {
      font-size: 14px;
      margin-bottom: 20px;
    }
  }
  .calendar {
    position: absolute;
    bottom: 0;
    width: 300px;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    background-color: #fff;
  }
}
.main {
  padding: 0;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  align-items: stretch;
  .main-show-view {
    .column();
    align-items: center;
    position: relative;
    width: 100%;
    min-width: 0;
    height: @main-height;
    overflow-y: scroll;
    padding: 20px;
    background-color: transparent;
    // background-color: rgba(244, 245, 245, 0.95);
    .back-top {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #ffce65;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
      text-align: center;
      font-size: 18px;
      line-height: 40px;
      color: #ffffff;
    }
    .minScroller();
  }
}
@media (max-width: 980px) {
  .home-page > .right-aside { display: none; }
  .home-page > .main { grid-row: 1; grid-template-columns: minmax(0, 1fr); margin-top: 0; padding: 0; }
  .main /deep/ .left-menu { display: none; }
  .main .main-show-view { position: relative; inset: auto; width: 100%; height: auto; min-height: 500px; padding: 14px; }
}
</style>
