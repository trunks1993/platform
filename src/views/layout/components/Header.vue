<template>
  <div class="head-container">
    <div class="head-date">
      <p>欢迎来到统一管理平台 {{currDate}} {{currTime}}</p>
    </div>
    <div class="head-title">
      <h1>统一管理平台登录界面</h1>
    </div>
    <div class="head-container-tools">
      <span class="item">
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
      <span class="item">
        <i class="el-icon-setting" />
        <span>设置</span>
      </span>
      <span class="item" v-popover:pannel>
        <i class="el-icon-user" />
        <span>{{userInfo.surUserName }}</span>
        <i class="el-icon-down" />
        <!-- <el-button v-popover:popover4 icon="el-icon-down"></el-button> -->
      </span>
    </div>

    <el-popover ref="pannel" width="100" trigger="click">
      <ul class="person-pannel">
        <li>个人中心</li>
        <li @click="logout">退出</li>
      </ul>
    </el-popover>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "部门管理"
        },
        {
          value: "选项2",
          label: "用户管理",
          disabled: true
        },
        {
          value: "选项3",
          label: "平台管理"
        },
        {
          value: "选项4",
          label: "功能管理"
        },
        {
          value: "选项5",
          label: "数据字典"
        }
      ],
      value: "",
      currDate: "",
      currTime: "",
      day: "",
      data: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getTime();
    let _this = this;
    this.timer = setInterval(() => {
      _this.getTime();
    }, 1000);
  },
  methods: {
    getTime() {
      //获取当前时间
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let dates = time.getDate();
      dates = dates < 10 ? "0" + dates : dates;
      let hour = time.getHours();
      hour = hour < 10 ? "0" + hour : hour;
      let minute = time.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      this.currDate = year + "-" + month + "-" + dates;
      this.currTime = hour + ":" + minute;
      this.day = time.getDay();
    },
    logout() {
      this.$store.dispatch("FedLogOut");
      window.sessionStorage.removeItem('menuList')
      window.location.reload();
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>
<style lang="scss" scoped>
.head-container {
  height: 118px;
  background: url(../../../assets/header-Bg.png);
  background-size: 100% 100%;
  color: #fff;
  position: relative;
  .head-date {
    line-height: 50px;
    display: inline-block;
    margin-left: 40px;
    p {
      margin: 0;
      display: inline-block;
      line-height: 50px;
      font-size: 14px;
    }
  }
  .head-title {
    display: inline-block;
    margin: 0 auto;
    width: 416px;
    position: absolute;
    left: 50%;
    margin-left: -218px;
    text-align: center;
    letter-spacing: 2px;
  }

  &-tools {
    display: inline-block;
    position: absolute;
    top: 20px;
    right: 40px;
    .item {
      cursor: pointer;
      & + .item {
        margin-left: 30px;
      }
    }
    i {
      margin-right: 10px;
      font-size: 18px;
      vertical-align: bottom;
    }
  }
}
.person-pannel {
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #4baefd;
  li {
    padding: 10px;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #0ebae1;
    }
  }
}
</style>
