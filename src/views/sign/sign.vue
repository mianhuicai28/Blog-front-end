<template>
  <section class="tag-page">
    <header class="tag-hero">
      <div>
        <span class="eyebrow">EXPLORE</span>
        <h1>按标签探索文章</h1>
        <p>从感兴趣的技术主题开始，快速找到对应内容。</p>
      </div>
      <div class="summary"><strong>{{ articles.length }}</strong><span>篇公开文章</span></div>
    </header>

    <div class="tag-grid" v-loading="loading">
      <button v-for="tag in tags" :key="tag.name" :class="['tag-card', { active: activeTag === tag.name }]" @click="selectTag(tag.name)">
        <span class="tag-icon">#</span><span class="tag-name">{{ tag.name }}</span><span class="tag-count">{{ tag.count }} 篇</span>
      </button>
    </div>

    <div class="result-panel">
      <div class="result-head">
        <div><span class="eyebrow">ARTICLES</span><h2>{{ activeTag ? `“${activeTag}”下的文章` : "全部文章" }}</h2></div>
        <el-button v-if="activeTag" plain round @click="activeTag = ''">查看全部</el-button>
      </div>
      <div v-if="filteredArticles.length" class="article-grid">
        <article v-for="article in filteredArticles" :key="article._id" class="article-card" @click="toDetail(article)">
          <div class="article-tags"><span v-for="tag in article.tags" :key="tag">{{ tag }}</span></div>
          <h3>{{ article.title }}</h3><p>{{ article.intro }}</p>
          <footer><span>{{ article.author }}</span><time>{{ article.time }}</time></footer>
        </article>
      </div>
      <el-empty v-else description="这个标签下暂时没有文章"></el-empty>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return { page_index: 3, articles: [], activeTag: "", loading: false };
  },
  computed: {
    tags() {
      const counts = this.articles.reduce((result, article) => {
        (article.tags || []).forEach((tag) => { result[tag] = (result[tag] || 0) + 1; });
        return result;
      }, {});
      return Object.keys(counts).map((name) => ({ name, count: counts[name] })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    },
    filteredArticles() {
      if (!this.activeTag) return this.articles;
      return this.articles.filter((article) => (article.tags || []).includes(this.activeTag));
    },
  },
  methods: {
    async loadArticles() {
      this.loading = true;
      try {
        const { data } = await this.$http.getAllArticle();
        this.articles = Array.isArray(data.data) ? [...data.data].reverse() : [];
      } finally { this.loading = false; }
    },
    selectTag(tag) { this.activeTag = this.activeTag === tag ? "" : tag; },
    toDetail(article) {
      this.$router.push({ name: "detail", query: { id: article._id, author_id: article.author_id } });
    },
  },
  created() { this.$store.commit("ctrlIndex", this.page_index); this.loadArticles(); },
  activated() { this.$store.commit("ctrlIndex", this.page_index); this.loadArticles(); },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");
.tag-page { width: 100%; margin-top: 20px; padding-bottom: 50px; }
.tag-hero, .result-panel { background: rgba(255,255,255,.94); border: 1px solid rgba(119,135,178,.14); border-radius: 20px; box-shadow: 0 16px 45px rgba(35,50,78,.08); }
.tag-hero { display: flex; align-items: center; justify-content: space-between; padding: 38px 42px; background: linear-gradient(135deg,#202c49,#35496f); color: #fff; h1 { margin: 8px 0; font-size: 34px; color: #fff; } p { margin: 0; color: rgba(255,255,255,.68); } }
.eyebrow { color: #f7c65c; font-size: 12px; font-weight: 700; letter-spacing: 2px; }
.summary { display: flex; flex-direction: column; align-items: flex-end; strong { font-size: 42px; color: #f7c65c; } span { color: rgba(255,255,255,.65); } }
.tag-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(170px,1fr)); gap: 14px; margin: 22px 0; min-height: 80px; }
.tag-card { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; padding: 18px; border: 1px solid #e7ebf3; border-radius: 14px; background: #fff; text-align: left; color: #283650; cursor: pointer; transition: .2s ease; &:hover, &.active { transform: translateY(-2px); border-color: #5d79c7; box-shadow: 0 10px 25px rgba(55,79,137,.12); } &.active { background: #edf2ff; } }
.tag-icon { grid-row: 1 / 3; align-self: center; font-size: 26px; color: #5d79c7; } .tag-name { font-size: 16px; font-weight: 700; } .tag-count { color: #8a96aa; font-size: 12px; }
.result-panel { padding: 32px; } .result-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; h2 { margin: 5px 0 0; } }
.article-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 16px; }
.article-card { padding: 22px; border: 1px solid #e8ecf4; border-radius: 14px; cursor: pointer; transition: .2s ease; &:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(35,50,78,.10); } h3 { margin: 14px 0 8px; color: #26354f; } p { min-height: 44px; color: #748096; line-height: 1.7; } footer { display: flex; justify-content: space-between; color: #98a1b2; font-size: 12px; } }
.article-tags span { display: inline-block; margin-right: 6px; padding: 3px 8px; border-radius: 20px; background: #edf2ff; color: #5770b4; font-size: 12px; }
@media (max-width: 768px) { .tag-page { margin-top: 20px; } .tag-hero { padding: 26px 22px; h1 { font-size: 26px; } } .summary { display: none; } .result-panel { padding: 20px; } }
</style>
