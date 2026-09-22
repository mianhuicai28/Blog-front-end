<template>
  <div class="nav-bar" ref="titBar" v-if="$store.state.nowPage !== 5">
    <h1 class="tit-main" @click="toIndex">For - Front End</h1>
    <img class="tit-img" src="@/assets/img/blog.png" alt="" />
    <p class="tit-dep">
      <span style="color: #c678dd">const </span>
      <span style="color: #d4b861">Blog.attribute</span>
      <span style="color: #56b6c2"> = </span>
      <span style="color: #ffffff">"只与前端有关的 Blog 网站"</span>
    </p>
    <div class="tit-bar">
      <router-link
        :class="item.isAct ? 'li-item-act' : 'li-item'"
        v-for="item in titList"
        :key="item.id"
        :to="item._id ? item.to + '/' + item._id : item.to"
        @click.native="switchTit(item.id)"
      >
        {{ item.name }}
      </router-link>
    </div>
    <div class="login-btn" v-show="!$store.state.isLogin" @click="toLogin">
      login
    </div>
    <div
      class="user-view"
      v-show="$store.state.isLogin"
      @mouseenter="menu_show = true"
      @click="menu_show = true"
      :title="$store.state.userInfo.name || $store.state.userInfo.username"
    >
      <img v-if="$store.state.userInfo.user_pic" :src="$store.state.userInfo.user_pic" />
      <div v-else class="avatar-fallback">
        {{ ($store.state.userInfo.name || $store.state.userInfo.username || "用").charAt(0) }}
      </div>
    </div>
    <!-- 显示用户菜单 -->
    <ul class="user-menu" v-show="menu_show" @mouseleave="menu_show = false">
      <li class="user-menu-name">
        {{ $store.state.userInfo.name || $store.state.userInfo.username }}
      </li>
      <li @click="toMe">个人中心</li>
      <li @click="toQuit">退出登录</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu_show: false,
      titList: [
        {
          id: 0,
          name: "博客",
          isAct: true,
          to: "/index",
        },

        {
          id: 1,
          name: "写文章",
          isAct: false,
          to: "/article",
          _id: "1",
        },
        {
          id: 2,
          name: "留言板",
          isAct: false,
          to: "/message",
        },
        {
          id: 3,
          name: "标签",
          isAct: false,
          to: "/sign",
        },
      ],
    };
  },
  methods: {
    syncWithRoute(path) {
      const activeMap = { "/index": 0, "/message": 2, "/sign": 3 };
      const activeId = path.startsWith("/article/") ? 1 : activeMap[path];
      this.titList.forEach((item) => { item.isAct = item.id === activeId; });
    },
    // 导航点击切换
    switchTit(e) {
      this.$store.commit("ctrlIndex", e);
      if (e === 4 || e === 5) {
        this.titList.forEach((item) => { item.isAct = false; });
        return;
      }
      if (this.titList[e]?.isAct) {
        return;
      }
      this.titList.forEach((item) => { item.isAct = item.id === e; });
    },
    // 点击logo跳转首页
    toIndex() {
      this.$router.push("/index");
      this.switchTit(0);
    },
    toLogin() {
      // this.$store.commit("isLogin", true);
      this.$router.push("/login");
      this.switchTit(5);
    },
    toMe() {
      this.menu_show = false;
      this.$router.push("/me");
      this.switchTit(4);
    },
    toQuit() {
      this.$store.commit("isLogin", false);
      this.$router.push("/index");
      this.switchTit(0);
      sessionStorage.removeItem("accessToken");
      this.$store.commit("getUserInfo", "");
      this.$store.commit("toSearch", true);
    },
  },
  mounted() {
    this.syncWithRoute(this.$route.path);
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(path) { this.syncWithRoute(path); },
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");
.nav-bar {
  // opacity: 0.9;
  z-index: 99;
  .row();
  align-items: center;
  width: @main-width;
  height: @nav-bar-height;
  border-radius: 16px;
  background: rgba(31, 42, 68, 0.94);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 35px rgba(24, 35, 58, .18);
  color: white;
  position: relative;
  .tit-main {
    opacity: 1;
    margin-left: 50px;
    color: rgb(237, 193, 57);
    cursor: pointer;
    user-select: none;
  }
  .tit-img {
    opacity: 1;
    margin-left: 20px;
    width: 36px;
    height: 36px;
  }
  .tit-dep {
    margin-left: 48px;
    user-select: none;
    font-size: 18px;
    font-style: italic;
  }
  .user-view {
    .row();
    align-items: center;
    position: absolute;
    right: 20px;
    width: 40px;
    height: 62px;
    border-radius: 15px;
    overflow: hidden;
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      transition: transform .2s ease, box-shadow .2s ease;
    }
    &:hover img,
    &:hover .avatar-fallback {
      transform: translateY(-1px);
      box-shadow: 0 0 0 3px rgba(242, 184, 75, .35);
    }
    .avatar-fallback {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f5c44e, #db9f28);
      color: #fff;
      font-weight: 700;
      transition: transform .2s ease, box-shadow .2s ease;
    }
  }
  .user-menu {
    .column();
    align-items: center;
    z-index: 100;
    position: absolute;
    top: 72px;
    right: 20px;
    width: 170px;
    padding: 20px 0 0 0;
    border-radius: 15px;
    background-color: rgba(89, 95, 112, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    li {
      margin-bottom: 20px;
      padding: 5px;
      cursor: pointer;
      border-bottom: 1px solid rgba(89, 95, 112, 0.9);
      &:hover {
        color: #dfbc4f;
        border-bottom: 1px solid #dfbc4f;
      }
    }
    .user-menu-name {
      width: 100%;
      margin: 0 0 12px;
      padding: 0 16px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, .14);
      color: #f7c65c;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: default;
      &:hover { border-bottom-color: rgba(255, 255, 255, .14); }
    }
  }
  .login-btn {
    position: absolute;
    right: 50px;
    height: 42px;
    border-radius: 15px;
    padding: 0 30px 0 30px;
    font-size: 20px;
    text-align: center;
    line-height: 42px;
    color: #dfbc4f;
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: rgba(112, 117, 134, 0.9);
    }
  }
  .tit-bar {
    position: absolute;
    right: 160px;
    .row();
    align-items: center;
    .li-item {
      display: block;
      height: 42px;
      border-radius: 15px;
      list-style: none;
      padding: 0 20px;
      font-size: 17px;
      line-height: 42px;
      color: white;
      user-select: none;
      &:hover {
        background-color: rgba(112, 117, 134, 0.9);
        color: rgb(237, 193, 57);
        transform: scale(0.8);
      }
    }
    .li-item-act {
      display: block;
      height: 42px;
      border-radius: 15px;
      list-style: none;
      padding: 0 20px;
      font-size: 17px;
      line-height: 42px;
      color: rgb(237, 193, 57);
      background-color: #ffff99;
      background-color: rgba(112, 117, 134, 0.9);
      user-select: none;
    }
  }
}

@media (max-width: 1320px) {
  .nav-bar .tit-dep { display: none; }
}

@media (max-width: 980px) {
  .nav-bar {
    height: auto;
    min-height: 62px;
    padding: 10px 16px;
    flex-wrap: wrap;
    .tit-main { margin-left: 0; font-size: 22px; }
    .tit-img, .tit-dep { display: none; }
    .tit-bar { position: static; order: 3; width: 100%; justify-content: center; overflow-x: auto; }
    .tit-bar .li-item, .tit-bar .li-item-act { padding: 0 14px; font-size: 15px; }
    .login-btn { top: 10px; right: 16px; padding: 0 16px; font-size: 16px; }
    .user-view { top: 10px; right: 12px; width: 40px; height: 40px; }
    .user-view p { display: none; }
  }
}
</style>
