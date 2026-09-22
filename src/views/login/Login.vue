<template>
  <div class="main-view">
    <div class="tit-view">
      <p>For-Front End</p>
      <span>只与前端有关的 Blog 网站</span>
    </div>

    <div class="center-view">
      <!-- 登录 -->
      <div class="login-view" :class="{ 'mobile-hidden': toSignUp }">
        <p>Sign In</p>
        <div class="input-item">
          <img src="@/assets/img/username.png" alt="" />
          <input
            v-model.trim="username"
            placeholder="请输入用户名"
            @change="checkName()"
          />
          <!-- <span v-if="isNull">用户名不能为空！</span> -->
        </div>
        <div class="input-item">
          <img src="@/assets/img/password.png" alt="" />
          <input
            v-model.trim="password"
            type="password"
            placeholder="请输入密码"
            @change="checkPassword()"
          />
          <!-- <span v-if="isNull">密码不能为空！</span> -->
        </div>
        <div class="forget-tip">忘记密码 ？</div>
        <button class="in-btn" @click="login">登录</button>
        <div class="tip-view"></div>
      </div>
      <!-- 注册 -->
      <div class="register-view" :class="{ 'mobile-hidden': !toSignUp }">
        <p>Sign Up</p>
        <div class="input-item">
          <img src="@/assets/img/username.png" alt="" />
          <input
            v-model.trim="rig_name"
            placeholder="请输入用户名"
            @change="checkRig_Name()"
          />
          <!-- <span v-if="isNull">用户名不能为空！</span> -->
        </div>
        <div class="input-item">
          <img src="@/assets/img/password.png" alt="" />
          <input
            v-model.trim="rig_word"
            type="password"
            placeholder="请输入密码"
            @change="checkRig_Password()"
          />
          <!-- <span v-if="isNull">密码不能为空！</span> -->
        </div>
        <div class="input-item">
          <img src="@/assets/img/email.png" alt="" />
          <input
            v-model.trim="rig_email"
            placeholder="请输入邮箱号码"
            @change="checkEmail()"
          />
          <!-- <span v-if="isNull">密码不能为空！</span> -->
        </div>
        <button class="in-btn" @click="signUp">注册</button>
      </div>
      <!-- 遮罩层 -->
      <div class="shadow" :class="toSignUp ? 'left' : 'right'">
        <div class="btn" @click="toSignUp = !toSignUp">
          {{ toSignUp ? "Sign In" : "Sign Up" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from "lodash";
export default {
  data() {
    return {
      page_index: 5,
      username: "",
      password: "",
      rig_name: "",
      rig_word: "",
      rig_email: "",
      isNull: false,
      toSignUp: false,
      regexp_name: /^[a-zA-Z0-9_-]{4,16}$/,
      regexp_word: /^[a-zA-Z0-9_]{6,18}$/,
      regexp_email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    };
  },
  activated() {
    this.$store.commit("ctrlIndex", this.page_index);
  },
  methods: {
    checkRig_Name() {
      // _.debounce(() => {
      if (!this.regexp_name.test(this.rig_name)) {
        this.$message.warning({
          showClose: true,
          message:
            "请输入正确的用户名（只允许包含字母、数字、下划线，长度限制 4-16）",
        });
      } else {
        return;
      }
      // }, 1000)();
    },
    checkEmail() {
      // _.debounce(() => {
      if (!this.regexp_email.test(this.rig_email)) {
        return this.$message.warning({
          showClose: true,
          message: "请输入正确的邮箱格式",
        });
      } else {
        return;
      }
      // }, 3000)();
    },
    checkRig_Password() {
      // _.debounce(() => {
      if (!this.regexp_word.test(this.rig_word)) {
        return this.$message.warning({
          showClose: true,
          message:
            "请输入正确的密码（只允许包含字母、数字、下划线，长度限制 6-18）",
        });
      } else {
        return;
      }
      // }, 1000)();
    },
    checkName() {
      // _.debounce(() => {
      if (!this.regexp_name.test(this.username)) {
        this.$message.warning({
          showClose: true,
          message:
            "请输入正确的用户名（只允许包含字母、数字、下划线，长度限制 4-16）",
        });
      } else {
        return;
      }
      // }, 1000)();
    },
    checkPassword() {
      // _.debounce(() => {
      if (!this.regexp_word.test(this.password)) {
        return this.$message.warning({
          showClose: true,
          message:
            "请输入正确的密码（只允许包含字母、数字、下划线，长度限制 6-18）",
        });
      } else {
        return;
      }
      // }, 1000)();
    },
    async login() {
      const res_name = this.regexp_name.test(this.username);
      const res_word = this.regexp_word.test(this.password);
      if (!res_name || !res_word) {
        return this.$message.warning({
          showClose: true,
          message: "请输入正确的登录信息",
        });
      }
      const login_info = this.$qs.stringify({
        username: this.username,
        password: this.password,
      });
      const { data: res } = await this.$http.login(login_info);
      if (res.status === 0) {
        const token = res.token;
        sessionStorage.setItem("accessToken", token);
        this.$message.success({
          showClose: true,
          message: res.tip,
        });
        this.$router.push("/index");
        this.$store.commit("isLogin", true);
        this.$store.commit("ctrlIndex", 0);
        this.getUserInfo();
      } else {
        this.$message.error({
          showClose: true,
          message: res.tip,
        });
      }
    },
    async signUp() {
      const res_name = this.regexp_name.test(this.rig_name);
      const res_word = this.regexp_word.test(this.rig_word);
      const res_email = this.regexp_email.test(this.rig_email);
      if (!res_name || !res_word || !res_email) {
        return this.$message.warning({
          showClose: true,
          message: "请输入正确的注册信息",
        });
      }
      const rig_info = this.$qs.stringify({
        username: this.rig_name,
        password: this.rig_word,
        email: this.rig_email,
      });
      const { data: res } = await this.$http.register(rig_info);
      res.status === 0
        ? this.$message.success({
            showClose: true,
            message: res.tip,
          })
        : this.$message.error({
            showClose: true,
            message: res.tip,
          });
    },
    async getUserInfo() {
      const { data } = await this.$http.getUserInfo();
      if (data.status === 0) {
        const userinfo = data.data;
        this.$store.commit("getUserInfo", userinfo);
      }
    },
  },
  components: {},
  created() {
    this.$store.commit("ctrlIndex", this.page_index);
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");

.right {
  right: 0;
  left: none;
  // animation: right 1s;
}
.left {
  left: 0;
  right: none;
}
.main-view {
  .column();
  width: 100%;
  min-height: 600px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  position: relative;
  .tit-view {
    position: absolute;
    top: 0;
    align-self: center;
    .column();
    align-items: center;
    p {
      color: rgb(223, 188, 79);
      font-size: 3.5rem;
    }

    margin-bottom: 20px;
    span {
      font-size: 1.5rem;
      color: white;
      opacity: 0.5;
    }
  }
  .center-view {
    position: relative;
    .row();
    justify-content: space-between;
    padding: 30px;
    min-width: 600px;
    border-radius: 15px;
    background-color: rgba(27, 28, 36, 0.5);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.97);
      .row();
      align-items: center;
      justify-content: center;
      .btn {
        width: 200px;
        height: 40px;
        background-color: rgb(223, 188, 79);
        color: white;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        user-select: none;

        &:active {
          opacity: 0.5;
          transform: scale(0.98);
        }
      }
    }
    .login-view {
      .column();
      p {
        align-self: center;
        font-size: 28px;
        color: white;
        margin-bottom: 30px;
      }
      .input-item {
        .row();
        align-items: center;
        margin-bottom: 20px;
        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }
        span {
          color: rgb(223, 188, 79);
        }
        input {
          padding: 0 15px;
          width: 200px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          font-size: 14px;
          outline: none;
          // background-color: transparent;
          background-color: #fff;
          border: none;
          margin-right: 10px;
          // border-bottom: 1px solid white;
          &:focus {
            outline: none;
          }
        }
      }
      .forget-tip {
        align-self: center;
        text-indent: 42px;
        color: white;
        font-size: 14px;
        line-height: 40px;
        margin-bottom: 20px;
        cursor: pointer;
        &:hover {
          color: rgb(223, 188, 79);
        }
      }
      .in-btn {
        margin-left: 42px;
        width: 200px;
        border-radius: 4px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 500;
        color: white;
        text-indent: 10px;
        letter-spacing: 10px;
        background-color: #409eff;
        user-select: none;
        border: none;
        cursor: pointer;
        &:active {
          opacity: 0.8;
          transform: scale(0.98);
        }
      }
    }
    .register-view {
      .column();
      p {
        align-self: center;
        font-size: 28px;
        color: white;
        margin-bottom: 30px;
      }
      .input-item {
        .row();
        align-items: center;
        margin-bottom: 20px;
        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }
        span {
          color: rgb(223, 188, 79);
        }
        input {
          padding: 0 15px;
          width: 200px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          font-size: 14px;
          outline: none;
          // background-color: transparent;
          background-color: #fff;
          border: none;
          margin-right: 10px;
          // border-bottom: 1px solid white;
          &:focus {
            outline: none;
          }
        }
      }
      .in-btn {
        margin-left: 42px;
        width: 200px;
        border-radius: 4px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 500;
        color: white;
        text-indent: 10px;
        letter-spacing: 10px;
        background-color: #409eff;
        user-select: none;
        border: none;
        cursor: pointer;
        &:active {
          opacity: 0.8;
          transform: scale(0.98);
        }
      }
    }
  }
}
@media (max-width: 680px) {
  .main-view {
    width: 100%;
    min-height: 100vh;
    padding: 28px 0;
    justify-content: flex-start;
    .tit-view {
      position: relative;
      top: auto;
      margin-bottom: 28px;
      text-align: center;
      p { margin: 0 0 8px; font-size: 34px; }
      span { font-size: 16px; }
    }
    .center-view {
      width: 100%;
      min-width: 0;
      padding: 24px;
      flex-direction: column;
      background: rgba(25, 35, 57, .94);
      .login-view,
      .register-view { width: 100%; }
      .mobile-hidden { display: none; }
      .input-item input { width: calc(100% - 42px); margin-right: 0; }
      .in-btn { width: calc(100% - 42px); margin-left: 42px; }
      .shadow {
        position: relative;
        inset: auto;
        order: 3;
        width: 100%;
        height: auto;
        margin-top: 22px;
        padding-top: 18px;
        border-top: 1px solid rgba(255,255,255,.12);
        background: transparent;
        .btn { width: 100%; background: transparent; border: 1px solid rgb(223,188,79); color: rgb(223,188,79); }
      }
    }
  }
}
</style>
