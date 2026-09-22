<template>
    <div ref="show" class="article-list" v-loading="loading">
    <div class="show-bar">
      <div class="tab-view">
        <p class="isAct">
          Change the world by code <i class="el-icon-loading"></i>
        </p>
      </div>
      <div class="search-view">
        <el-input
          placeholder="请输入内容"
          v-model="input"
          class="input-with-select"
          @keyup.enter.native="search"
        >
          <el-select
            :popper-append-to-body="false"
            v-model="select"
            slot="prepend"
          >
            <el-option label="全文" value="content"></el-option>
            <el-option label="标题" value="title"></el-option>
          </el-select>
          <el-button slot="append" :loading="searching" @click="search">搜索</el-button>
        </el-input>
      </div>
    </div>
    <div v-if="isSearch" style="margin-bottom: 10px">
      <el-alert
        :title="searchResult.tip"
        :type="searchResult.data.length === 0 ? 'warning' : 'success'"
        close-text="清除搜索"
        show-icon
        @close="returnAll"
      >
        <slot>{{ `搜索到 ${searchResult.data.length} 条内容` }}</slot>
      </el-alert>
    </div>
    <div class="show-list">
      <div
        class="show-item"
        v-for="item in pagedArticles"
        :key="item.index"
        @click="toDetail(item)"
      >
        <div class="top-show">
          <p class="title">{{ item.title }}</p>
          <p class="author">{{ item.author }}</p>
        </div>

        <div class="center-show">
          <div class="main-show">
            <p class="info">
              {{ item.intro }}
            </p>
            <div class="bottom-show">
              <div class="tags">
                <span class="tag" v-for="tag in item.tags" :key="tag">
                  # {{ tag }}
                </span>
              </div>
              <p class="time">{{ item.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-view" v-if="articles.length === 0">
        <el-empty description="暂无文章，登录后发布第一篇吧"></el-empty>
      </div>
    </div>
    <el-pagination
      v-if="articles.length > pageSize"
      class="article-pagination"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="articles.length"
      :current-page.sync="currentPage"
    />
  </div>
</template>

<script>
export default {
  props: {
    articles: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      input: "",
      select: "title",
      isSearch: false,
      searchResult: { tip: "", data: [] },
      currentPage: 1,
      pageSize: 6,
      searching: false,
    };
  },
  computed: {
    pagedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.articles.slice(start, start + this.pageSize);
    },
  },
  watch: {
    articles() { this.currentPage = 1; },
  },
  methods: {
    toDetail(e) {
      this.$router.push({
        name: "detail",
        query: {
          id: e._id,
          author_id: e.author_id,
        },
      });
    },
    async search() {
      if (this.input === "") {
        return this.$message.warning({
          showClose: true,
          message: "不可搜索空值",
        });
      }
      const query = this.$qs.stringify({
        select: this.select,
        input: this.input,
      });
      this.searching = true;
      try {
        const { data } = await this.$http.searchByInput(query);
        this.isSearch = true;
        this.$store.commit("toSearch", false);
        this.$store.commit("searchArticles", data.data || []);
        this.searchResult = { ...data, data: data.data || [] };
      } catch (_) {
        // 全局请求拦截器已提示错误；保留当前列表，避免失败后清空用户正在看的内容。
      } finally {
        this.searching = false;
      }
    },
    returnAll() {
      this.isSearch = false;
      this.$store.commit("toSearch", true);
      this.input = "";
    },
  },
};
</script>
<style lang="less" scoped>
@import url("@/assets/less/index.less");
.show-bar {
  .row();
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  margin-bottom: 12px;
  // border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  // border-bottom: 1px solid #dfe0e2;
  .tab-view {
    .row();
    align-items: center;
    p {
      margin-right: 10px;
      font-size: 16px;
      color: #999;
      cursor: pointer;
    }
    .isAct {
      color: rgb(237, 193, 57);
      font-weight: 500;
    }
  }
  .search-view {
    width: min(450px, 70%);
    /deep/ .el-select .el-input {
      width: 100px;
    }
    /deep/ .el-input__inner {
      text-align: left;
    }
  }
}
@media (max-width: 1250px) {
  .show-bar .tab-view { display: none; }
  .show-bar .search-view { width: 100%; }
}
.back-top {
  position: fixed;
  bottom: 40px;
  right: 360px;
  width: 60px;
  height: 60px;
  cursor: pointer;
}
.show-list {
  position: relative;
  width: 100%;
  // min-height: 560px;
  // background-color: pink;
  .column();
  align-items: center;
  .show-item {
    width: 100%;
    min-height: 150px;
    background-color: #fff;
    border-radius: 14px;
    margin-bottom: 20px;
    border: 1px solid #e8ecf3;
    padding: 0 20px;
    transition: transform .2s ease, box-shadow .2s ease;
    cursor: pointer;
    .column();
    align-items: center;
    &:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(35, 50, 78, .09); }
    &:last-child {
      margin-bottom: 0px;
    }
    .top-show {
      .row();
      justify-content: space-between;
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #dfe0e2;
      .title {
        width: 50%;
        font-size: 16px;
        font-weight: 700;
        line-height: 18px;
        text-align-last: left;
        letter-spacing: 1px;
        color: #444;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; //行数
      }
      .author {
        // color: @orange;
        font-weight: 550;
        span {
          color: #86909c;
        }
      }
    }

    .center-show {
      .row();
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      .main-show {
        .column();
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-height: 130px;
        height: auto;
        gap: 16px;
        .info {
          align-self: flex-start;
          display: -webkit-box;
          font-size: 14px;
          letter-spacing: 1px;
          color: #86909c;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4; //行数
        }
        .bottom-show {
          .row();
          align-items: center;
          width: 100%;
          justify-content: space-between;
          .tags {
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            min-width: 0;
            padding-right: 16px;
            .tag {
              display: inline-flex;
              align-items: center;
              max-width: 100%;
              padding: 4px 9px;
              border-radius: 999px;
              background: #fff7df;
              color: #a8760c;
              font-size: 12px;
              font-weight: 600;
              line-height: 1.2;
              white-space: nowrap;
            }
          }
          .time {
            flex: 0 0 auto;
            min-width: 120px;
            text-align: right;
            font-size: 14px;
            color: #86909c;
          }
        }
      }
      .img {
        width: 210px;
        height: 130px;
        border-radius: 4px;
      }
    }
  }
}
.article-list { width: 100%; }
.empty-view { padding: 60px 0; }
.article-pagination { display: flex; justify-content: center; margin-top: 24px; }
@media (max-width: 768px) {
  .show-bar { height: auto; align-items: stretch; flex-direction: column; gap: 12px; }
  .show-bar .search-view { width: 100%; }
  .show-list .show-item { padding: 0 14px; }
  .show-list .show-item .center-show .main-show { height: auto; min-height: 130px; }
  .show-list .show-item .center-show .main-show .bottom-show { flex-direction: column; align-items: flex-start; gap: 8px; }
  .show-list .show-item .center-show .main-show .bottom-show .tags { width: 100%; padding-right: 0; }
  .show-list .show-item .center-show .main-show .bottom-show .time { align-self: flex-end; min-width: auto; font-size: 12px; }
}
</style>
