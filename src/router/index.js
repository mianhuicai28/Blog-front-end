import Vue from "vue";
import VueRouter from "vue-router";
import gtMessage from "../utils/message";

// 页面按需加载，降低首屏包体积
const Index = () => import("../views/index/Index.vue");
const Article = () => import("../views/article/Article.vue");
const Message = () => import("../views/message/Message.vue");
const Me = () => import("../views/me/Me.vue");
const Sign = () => import("../views/sign/sign.vue");
const Login = () => import("../views/login/Login.vue");
const ArticleShow = () => import("../views/article-show/Article-show.vue");
const MyInfo = () => import("../components/myModule/MyInfo.vue");
const MyArticle = () => import("../components/myModule/MyArticle.vue");
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: Index,
  },
  {
    path: "/article/:_id",
    name: "article",
    component: Article,
    meta: { authRequired: true },
  },
  {
    path: "/article_show",
    name: "detail",
    component: ArticleShow,
  },
  {
    path: "/message",
    name: "message",
    component: Message,
  },
  {
    path: "/sign",
    name: "sign",
    component: Sign,
  },
  {
    path: "/me",
    name: "me",
    component: Me,
    redirect: "/me/my_info",
    meta: { authRequired: true },
    children: [
      {
        path: "my_info",
        name: "我的信息",
        component: MyInfo,
      },
      {
        path: "my_article",
        name: "我的博文",
        component: MyArticle,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "*",
    redirect: "/index",
  },
];
const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("accessToken");
  const authRequired = to.matched.some((record) => record.meta.authRequired);
  if (authRequired && !token) {
    gtMessage.warning({
      showClose: true,
      message: "登录后才可进入该模块",
    });
    next({ name: "login" });
  } else next();
});
// 防止重复同一个路由;
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
