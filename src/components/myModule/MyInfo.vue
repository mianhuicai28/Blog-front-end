<template>
  <div>
    <div class="user-info">
      <div class="info-tit">账号信息</div>
      <div class="user-name">
        <span>昵称 :</span>
        <div v-show="!isChange">
          <p>{{ userinfo.name }}</p>
        </div>
        <div v-show="isChange" style="width: 100px">
          <el-input
            v-model.trim="userinfo.name"
            show-word-limit
            placeholder="请输入昵称"
            maxlength="16"
          ></el-input>
        </div>
      </div>
      <div class="user-img">
        <span>头像 :</span>
        <div v-show="!isChange" class="upload">
          <p v-if="!userinfo.user_pic">暂无头像，请点击修改信息上传头像</p>
          <img v-else :src="userinfo.user_pic" alt="" />
        </div>
        <div v-show="isChange" class="upload">
          <el-button
            icon="el-icon-plus"
            style="margin-right: 20px"
            @click="touchInput"
            circle
          ></el-button>
          <input
            id="addImg"
            ref="addImg"
            name="addImg"
            style="display: none"
            type="file"
            @change="getImg($event)"
            accept="image/jpeg,image/jpg,image/png"
          />
          <img v-show="iconBase64" :src="iconBase64" />
        </div>
      </div>
      <div class="user-email">
        <span>邮箱 :</span>
        <!-- <p>{{ userinfo.email }}</p> -->
        <div v-show="!isChange">
          <p>{{ userinfo.email }}</p>
        </div>
        <div v-show="isChange" style="width: 100px">
          <el-input
            v-model="userinfo.email"
            placeholder="请输入邮箱"
          ></el-input>
        </div>
      </div>
      <div class="user-intro">
        <span>个人简介 :</span>

        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model.trim="userinfo.intro"
          maxlength="160"
          resize="none"
          :readonly="isChange ? false : true"
          autosize
          show-word-limit
        >
        </el-input>
      </div>
    </div>
    <!-- btn -->
    <div class="btn-view">
      <el-button type="primary" plain @click="isChange = true"
        >修改信息</el-button
      >
      <el-button v-show="isChange" type="info" @click="cancel" plain
        >取消修改</el-button
      >
      <el-button v-show="isChange" type="success" @click="save" plain
        >保存信息</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isChange: false,
      imageUrl: "",
      iconBase64: this.$store.state.userInfo.user_pic,
      userinfo: {
        name: "",
        email: "",
        intro: "",
        user_pic: "",
      },
      regexp_email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    };
  },
  created() {
    this.isChange = false;
    this.getUserInfo();
  },
  activated() {
    this.isChange = false;
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const { data } = await this.$http.getUserInfo();
      this.userinfo = data.data;
    },
    cancel() {
      this.isChange = false;
      this.getUserInfo();
    },
    getImg(e) {
      let file = e.target.files[0];
      if (file) {
        if (file.size > 2097152) {
          this.$message.warning({
            showClose: true,
            message: "图片大小不可超过2MB",
          });
          return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.iconBase64 = reader.result;
        };
        reader.onerror = () => {
          this.$message.error("图片读取失败，请重新选择");
        };
      }
    },
    touchInput() {
      this.$refs.addImg.dispatchEvent(new MouseEvent("click"));
    },
    async save() {
      const res_email = this.regexp_email.test(this.userinfo.email);
      if (
        !res_email ||
        this.userinfo.name === "" ||
        this.userinfo.intro === ""
      ) {
        return this.$message.warning({
          showClose: true,
          message: "请输入正确的用户信息",
        });
      }
      const newInfo = this.$qs.stringify({
        name: this.userinfo.name,
        email: this.userinfo.email,
        intro: this.userinfo.intro,
        img: this.iconBase64,
      });
      const { data } = await this.$http.updateInfo(newInfo);
      if (data.status === 0) {
        this.$message.success({
          showClose: true,
          message: data.tip,
        });
        const info = await this.$http.getUserInfo();
        this.$store.commit("getUserInfo", info.data.data);
        this.getUserInfo();
        this.isChange = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");
.user-info {
  margin-bottom: 50px;
  .info-tit {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  span {
    display: block;
    color: @orange;
    font-size: 1.25rem;
    width: 100px;
    text-align: right;
    margin-right: 20px;
  }
  .user-name {
    .row();
    align-items: center;
    font-size: 1.25rem;
    margin-bottom: 15px;
    position: relative;
    /deep/ .el-input {
      width: 300px;
    }
  }
  .user-intro {
    .row();
    font-size: 1rem;
    margin-bottom: 15px;
    /deep/ .el-textarea {
      width: min(600px, calc(100% - 120px));
      .el-textarea__inner {
        width: 100%;
      }
    }
  }
  .user-img {
    .row();
    align-items: center;
    font-size: 1.25rem;
    margin-bottom: 15px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 4px;
    }
  }
  .user-email {
    .row();
    align-items: center;
    font-size: 1.25rem;
    margin-bottom: 15px;
    /deep/ .el-input {
      width: 300px;
    }
  }
}
.upload {
  img {
    width: 60px;
    height: 60px;
    border-radius: 4px;
  }
}
.btn-view {
  width: min(360px, 100%);
  margin-left: 120px;
  .row();
  align-items: center;
  justify-content: space-between;
}
@media (max-width: 640px) {
  .user-info > div:not(.info-tit) { align-items: flex-start; flex-direction: column; gap: 8px; }
  .user-info span { width: auto; text-align: left; margin: 0; }
  .user-info .user-name /deep/ .el-input,
  .user-info .user-email /deep/ .el-input,
  .user-info .user-intro /deep/ .el-textarea { width: 100%; }
  .btn-view { margin-left: 0; flex-wrap: wrap; gap: 8px; justify-content: flex-start; }
}
</style>
