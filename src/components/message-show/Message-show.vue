<template>
  <div>
    <div class="edit-view">
      <div class="user-img">
        {{ name.length === 0 ? "游" : name.charAt(0) }}
      </div>
      <div class="edit-box">
        <div class="edit-top">
          <div class="name">
            <el-input
              placeholder="壮士请留名"
              v-model="name"
              maxlength="16"
              minlength="1"
              clearable
            >
              <i slot="prepend" class="el-icon-user-solid"></i>
            </el-input>
          </div>
        </div>
        <div class="edit-center">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            :autosize="{ minRows: 6 }"
            maxlength="520"
            show-word-limit
            resize="none"
          >
          </el-input>
        </div>
        <div class="edit-bottom">
          <div style="margin-left: 15px">
            <i class="el-icon-loading"></i
            ><span style="margin-left: 5px">支持markdown语法</span>
          </div>
          <div :class="['sumbit', { disabled: submitting }]" @click="addMessage">
            {{ submitting ? "正在发布" : "发布留言" }}
          </div>
        </div>
      </div>
    </div>
    <template v-if="data.length > 0">
      <div class="show-item" v-for="(item, index) in data" :key="index">
        <div
          class="user-img"
          :style="{ color: '#fff', background: item.imgColor }"
        >
          {{ item.name.charAt(0) }}
        </div>
        <div class="show-main">
          <div class="show-head">{{ item.name }}</div>
          <div class="show-box">
            <div class="markdown-body" v-html="item.comment" v-highlight></div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="tip">暂无留言</p>
    </template>
  </div>
</template>

<script>
import { marked } from "marked";
export default {
  props: {
    data: {
      type: Array,
    },
  },
  data() {
    return {
      name: "",
      textarea: "",
      submitting: false,
    };
  },
  methods: {
    async addMessage() {
      if (this.submitting) return;
      if (this.name === "") {
        return this.$message.warning({
          showClose: true,
          message: "昵称不可以为空哦",
          type: "warning",
        });
      }
      if (this.textarea === "") {
        return this.$message.warning({
          showClose: true,
          message: "内容不可以为空哦",
          type: "warning",
        });
      }
      const new_comment = this.$qs.stringify({
        name: this.name,
        content: this.textarea,
        imgColor: this.produceColor(),
      });
      this.submitting = true;
      try {
        const { data } = await this.$http.postMessage(new_comment);
        if (data.status === 0) {
          data.data.comment = marked.parse(data.data.content);
          this.$store.commit("addMessage", data.data);
          this.name = "";
          this.textarea = "";
          this.$message.success({
            showClose: true,
            message: data.tip || "发布成功",
          });
        }
      } catch (_) {
        // 全局请求拦截器已反馈失败原因。
      } finally {
        this.submitting = false;
      }
    },
    produceColor() {
      let str = "#";
      const arr = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
      ];
      for (let i = 0; i < 6; i++) {
        let num = parseInt(Math.random() * 16);
        str += arr[num];
      }
      // console.log(str);
      return str;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/index.less");
@import url("../../assets//less/markdown-style.css");
.edit-view {
  width: 100%;
  min-height: 260px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  .row();
  justify-content: space-between;
  .user-img {
    width: 50px;
    height: 50px;
    .row();
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }
  }
  .edit-box {
    width: calc(100% - 70px);
    min-height: 230px;
    // border: 1px solid black;
    border-radius: 4px;
    .edit-top {
      .row();
      align-items: center;
      justify-content: space-between;
      .name {
        width: 320px;
      }
      margin-bottom: 10px;
    }
    .edit-center {
      width: 100%;
      min-height: 138px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .edit-bottom {
      width: 100%;
      height: 42px;
      .row();
      align-items: center;
      justify-content: space-between;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      span {
        color: #1890ff;
      }
      .sumbit {
        width: 88px;
        height: 32px;
        margin-right: 5px;
        background-color: #1890ff;
        border-radius: 4px;
        color: #fff;
        text-align: center;
        font-size: 14px;
        line-height: 32px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        &.disabled { cursor: not-allowed; opacity: 0.65; }
      }
    }
  }
}
@media (max-width: 640px) {
  .edit-view { gap: 10px; }
  .edit-view .user-img { width: 40px; height: 40px; }
  .edit-view .edit-box { width: calc(100% - 50px); }
  .edit-view .edit-box .edit-top .name { width: 100%; }
}
.show-item {
  margin-top: 30px;
  width: 100%;
  min-height: 134px;
  border-radius: 4px;
  border-bottom: 1px solid #eee;
  .row();
  justify-content: space-between;
  .user-img {
    width: 50px;
    height: 50px;
    .row();
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }
  }
  .show-main {
    width: calc(100% - 70px);
    min-height: 134px;
    margin-bottom: 20px;
    .show-head {
      padding-left: 15px;
      width: 100%;
      height: 40px;
      border: 1px solid #dcdfe6;
      font-size: 14px;
      color: rgb(237, 193, 57);
      line-height: 40px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; //行数
    }
    .show-box {
      width: 100%;
      min-height: 64px;
      padding: 5px 15px;
      border-radius: 0 0 4px 4px;
      border: 1px solid #dcdfe6;
    }
  }
}
@media (max-width: 640px) {
  .show-item { gap: 10px; }
  .show-item .user-img { width: 40px; height: 40px; }
  .show-item .show-main { width: calc(100% - 50px); }
}
.tip {
  margin-top: 30px;
  color: #edc139;
  text-align: center;
  font-size: 1.5rem;
}
</style>
