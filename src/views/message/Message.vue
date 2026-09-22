<template>
  <div class="message-page">
    <div class="comment-view" v-loading="loading">
      <Message-show :data="messages"></Message-show>
      <el-backtop target=".comment-view" :right="40" :bottom="60">
        <div class="back-top">UP</div>
      </el-backtop>
    </div>
  </div>
</template>

<script>
import MessageShow from "@/components/message-show/Message-show.vue";
import { marked } from "marked";

export default {
  data() {
    return {
      page_index: 2,
      loading: false,
    };
  },
  methods: {
    async getAllMessage() {
      this.loading = true;
      try {
        const { data } = await this.$http.getAllMessage();
        const messages = Array.isArray(data.data) ? data.data : [];
        messages.forEach((item) => {
          item.comment = marked.parse(item.content);
        });
        this.$store.commit("getAllMessage", messages);
      } catch (_) {
        this.$store.commit("getAllMessage", []);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
  },
  created() {
    this.$store.commit("ctrlIndex", this.page_index);
    this.getAllMessage();
  },
  updated() {
    // this.getAllComment();
  },
  activated() {
    this.$store.commit("ctrlIndex", this.page_index);
    this.getAllMessage();
  },

  components: {
    MessageShow,
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");
.message-page {
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: @main-height;
  margin-top: 20px;
  .column();
  align-items: center;
  .comment-view {
    width: 100%;
    min-height: @main-height;
    height: auto;
    max-height: @main-height;
    overflow: scroll;
    .minScroller();
    border-radius: 10px;
    padding: 20px;
    background-color: rgba(255, 255, 255);
    .column();
    align-items: center;
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
  }
}
@media (max-width: 768px) {
  .message-page .comment-view { max-height: none; padding: 14px; }
}
</style>
