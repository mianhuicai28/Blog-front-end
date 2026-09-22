<template>
  <div class="page-layout editor-page">
    <!-- 右aside -->
    <div class="right-aside">
      <div class="info-view">
        <div class="tit">
          <p>博文 - 标题</p>
          <el-input
            type="text"
            placeholder="请输入标题"
            v-model="new_title"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </div>
        <div class="tag">
          <p>博文 - 标签</p>
          <tags @selTags="getTags"></tags>
        </div>
        <div class="intro">
          <p>博文 - 简介</p>
          <el-input
            type="textarea"
            placeholder="请输入简介"
            v-model="new_intro"
            maxlength="160"
            show-word-limit
            :autosize="{ minRows: 6 }"
            resize="none"
          >
          </el-input>
        </div>
      </div>
      <div v-if="!isUpdate" class="sumbit" @click="sumbit">发布博文</div>
      <div v-else class="sumbit" @click="update">更新博文</div>
    </div>
    <!-- <div v-if="now_page !== 0" class="right-aside"></div> -->
    <!-- 主体区 -->
    <div class="main">
      <!-- <Markdown @getContent="getContent"></Markdown> -->
      <mavon-editor
        :toolbars="markdownOption"
        v-model="new_content"
        ref="md"
        :ishljs="true"
        @save="save"
        @change="change"
      />
    </div>
  </div>
</template>

<script>
import Markdown from "@/components/markdown/Mark-down.vue";
import Tags from "@/components/tags/tag.vue";
import dayjs from "dayjs";
export default {
  data() {
    return {
      page_index: 1,
      isUpdate: false,
      new_title: "",
      new_intro: "",
      new_tags: [],
      new_content: "请输入博文内容（支持Markdown语法）",
      markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      handbook: "请输入博文内容（支持Markdown语法）",
    };
  },
  methods: {
    async sumbit() {
      if (this.new_title === "") {
        return this.$message.warning({
          showClose: true,
          message: "标题不可以为空哦",
          type: "warning",
        });
      }
      if (
        Array.prototype.isPrototypeOf(this.new_tags) &&
        this.new_tags.length === 0
      ) {
        return this.$message.warning({
          showClose: true,
          message: "请选择标签哦",
          type: "warning",
        });
      }
      if (this.new_intro === "") {
        return this.$message.warning({
          showClose: true,
          message: "简介不可以为空哦",
          type: "warning",
        });
      }
      if (this.new_content === "" || this.new_content === this.handbook) {
        return this.$message.warning({
          showClose: true,
          message: "内容不可以为空哦",
          type: "warning",
        });
      }
      const new_article = this.$qs.stringify(
        {
          title: this.new_title,
          intro: this.new_intro,
          tags: this.new_tags,
          content: this.new_content,
          time: dayjs(new Date()).format(
            "YYYY" + "年" + "MM" + "月" + "DD" + "日"
          ),
        }, // 数组序列化
        { indices: false }
      );
      const { data } = await this.$http.publishArticle(new_article);
      if (data.status === 0) {
        this.$message.success({
          showClose: true,
          message: data.tip,
        });
        this.$router.push({
          name: "detail",
          query: { id: data.data._id, author_id: data.data.author_id },
        });
      }
    },
    async update() {
      if (this.new_title === "") {
        return this.$message.warning({
          showClose: true,
          message: "标题不可以为空哦",
          type: "warning",
        });
      }
      if (
        Array.prototype.isPrototypeOf(this.new_tags) &&
        this.new_tags.length === 0
      ) {
        return this.$message.warning({
          showClose: true,
          message: "请选择标签哦",
          type: "warning",
        });
      }
      if (this.new_intro === "") {
        return this.$message.warning({
          showClose: true,
          message: "简介不可以为空哦",
          type: "warning",
        });
      }
      if (this.new_content === "") {
        return this.$message.warning({
          showClose: true,
          message: "内容不可以为空哦",
          type: "warning",
        });
      }
      const update_article = this.$qs.stringify(
        {
          title: this.new_title,
          intro: this.new_intro,
          tags: this.new_tags,
          content: this.new_content,
          id: this.$route.params._id,
        }, // 数组序列化
        { indices: false }
      );
      const { data } = await this.$http.updateArticle(update_article);
      if (data.status === 0) {
        this.$message.success({
          showClose: true,
          message: data.tip,
        });
        this.$router.push("/me/my_article");
      }
    },
    save() {},
    change(e, res) {
      // console.log(e);
      this.new_content = e;
    },
    getTags(tags) {
      this.new_tags = tags;
    },
    getContent(val) {
      this.new_content = val;
    },
    async getArticleDetail(e) {
      // console.log(e);
      const query = this.$qs.stringify({
        article_id: e,
      });
      const { data } = await this.$http.getArticleDetail(query);
      if (data.status === 0) {
        const article = data.data;
        this.new_title = article.title;
        this.new_intro = article.intro;
        this.new_content = article.content;
        this.$message.warning({
          showClose: true,
          message: "请重新选择标签",
        });
      }
    },
  },
  created() {
    this.$store.commit("ctrlIndex", this.page_index);
  },
  activated() {
    this.$store.commit("ctrlIndex", this.page_index);
    if (this.$route.params._id === "1") {
      Object.assign(this.$data, this.$options.data());
    } else {
      this.getArticleDetail(this.$route.params._id);
      this.isUpdate = true;
    }
  },
  destroyed() {
    Object.assign(this.$data, this.$options.data());
  },
  components: {
    Tags,
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");
/deep/ .markdown-body {
  width: 100%;
  min-height: 560px;
}
/deep/ .v-show-content {
  border-bottom-right-radius: 4px;
}
.main {
  overflow-y: auto;
  overflow-x: auto;
  height: @main-height;
  overflow: scroll;
  .noneScroller();
}
.right-aside {
  height: @main-height;
  align-items: center;
  .info-view {
    width: 260px;
    height: 500px;
    .noneScroller();
    overflow-x: hidden;
    .tit {
      .column();
      align-items: flex-start;
      width: 260px;
      padding: 20px;
      border-radius: 10px;
      color: #edc139;
      background-color: rgba(112, 117, 134, 0.9);
      margin-bottom: 20px;
      p {
        font-size: 18px;
        line-height: 18px;
        margin-bottom: 20px;
      }
    }
    .intro {
      .column();
      align-items: flex-start;
      width: 260px;
      padding: 20px;
      border-radius: 10px;
      color: #edc139;
      background-color: rgba(112, 117, 134, 0.9);
      p {
        font-size: 18px;
        line-height: 18px;
        margin-bottom: 20px;
      }
      /deep/ .el-textarea__inner {
        min-height: 122px;
        .minScroller();
      }
    }
    .tag {
      .column();
      align-items: flex-start;
      width: 260px;
      padding: 20px;
      border-radius: 10px;
      color: #edc139;
      background-color: rgba(112, 117, 134, 0.9);
      margin-bottom: 20px;
      p {
        font-size: 18px;
        line-height: 18px;
        margin-bottom: 20px;
      }
      /deep/ .el-input__inner {
        padding: 0 15px;
      }
    }
  }
  .sumbit {
    position: absolute;
    bottom: 20px;
    width: 260px;
    height: 40px;
    border-radius: 4px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
    letter-spacing: 8px;
    text-indent: 8px;
    color: white;
    background-color: #edc139;
    user-select: none;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
.editor-page > .main,
.editor-page > .right-aside { position: relative; inset: auto; width: 100%; margin: 0; }
.editor-page > .main { min-width: 0; padding: 0; overflow: hidden; }
.editor-page > .right-aside { padding: 20px; }
.editor-page /deep/ .v-note-wrapper { width: 100%; min-width: 0; min-height: 100%; z-index: 1; }

@media (max-width: 980px) {
  .editor-page > .right-aside { height: auto; align-items: stretch; padding: 16px; }
  .editor-page > .right-aside .info-view {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .editor-page > .right-aside .info-view .tit,
  .editor-page > .right-aside .info-view .tag,
  .editor-page > .right-aside .info-view .intro { width: 100%; margin: 0; }
  .editor-page > .right-aside .sumbit { position: static; width: 100%; margin-top: 14px; }
  .editor-page > .main { grid-row: 2; height: 620px; }
}
@media (max-width: 680px) {
  .editor-page > .right-aside .info-view { grid-template-columns: 1fr; }
  .editor-page > .main { height: 560px; }
  .editor-page /deep/ .v-note-op { overflow-x: auto; overflow-y: hidden; }
  .editor-page /deep/ .v-note-panel { display: block; }
  .editor-page /deep/ .v-note-edit,
  .editor-page /deep/ .v-note-show { width: 100% !important; }
  .editor-page /deep/ .v-note-show { display: none; }
}
</style>
