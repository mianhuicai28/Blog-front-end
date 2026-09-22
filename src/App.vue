<template>
  <div id="app" class="app" ref="app">
    <!-- 导航栏 -->
    <Titbar id="tit-bar"></Titbar>
    <keep-alive exclude="detail">
      <router-view></router-view>
    </keep-alive>
    <particles-bg type="square" num="5" moveSpeed="0.1" :bg="true" />
  </div>
</template>
<script>
import Titbar from "./components/tit-bar/Titbar.vue";
import { ParticlesBg } from "particles-bg-vue";
export default {
  created() {
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign({}, JSON.parse(sessionStorage.getItem("store")))
      );
    }

    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
  components: {
    Titbar,
    ParticlesBg,
  },
};
</script>
<style lang="less">
@import url("@/assets/less/index.less");
@nav-bar-height: 62px;
@nav-background-color: #ff4955;
#app {
  .column();
  width: calc(100% - 32px);
  max-width: 1480px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  align-items: center;
  overflow-x: hidden;
}

#tit-bar {
  position: sticky;
  top: 20px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  #app { width: calc(100% - 20px); }
  #tit-bar { top: 10px; margin-top: 10px; }
}

/* 滚动槽 */
// ::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
//   box-shadow: inset006pxrgba(0, 0, 0, 0.3);
//   border-radius: 10px;
// }
</style>
