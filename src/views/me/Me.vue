<template>
  <div class="me-view">
    <my-menu></my-menu>
    <div class="me-main">
      <keep-alive exclude="my_article">
        <router-view></router-view>
      </keep-alive>
    </div>
    <el-backtop target=".me-main" :right="40" :bottom="60">
      <div class="back-top">UP</div>
    </el-backtop>
  </div>
</template>

<script>
import MyMenu from "@/components/myModule/MyMenu.vue";
export default {
  data() {
    return {
      page_index: 4,
    };
  },
  activated() {
    this.$store.commit("ctrlIndex", this.page_index);
  },
  components: {
    MyMenu,
  },
  created() {
    this.$store.commit("ctrlIndex", this.page_index);
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");
.me-view {
  position: relative;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  align-items: stretch;
  min-width: 0;
  margin-top: 20px;
  width: 100%;
  height: @main-height;
  .me-menu {
    position: relative;
    inset: auto;
    width: 100%;
    height: 100%;
    border-radius: 10px 0 0 10px;
    background-color: #626878;
    overflow: hidden;
  }
  .me-main {
    position: relative;
    inset: auto;
    min-width: 0;
    padding: 20px;
    width: 100%;
    height: 100%;
    border-radius: 0 10px 10px 0;
    background-color: #fff;
    overflow: scroll;
    .minScroller();
  }
  .back-top {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #ffce65 !important;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    font-size: 18px;
    line-height: 40px;
    color: #ffffff;
  }
}
@media (max-width: 768px) {
  .me-view { grid-template-columns: 1fr; height: auto; }
  .me-view .me-menu { position: relative; width: 100%; height: auto; border-radius: 12px 12px 0 0; }
  .me-view .me-main { position: relative; width: 100%; height: auto; min-height: 520px; border-radius: 0 0 12px 12px; }
}
</style>
