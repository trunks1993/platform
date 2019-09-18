<template>
  <div class="user">
    <div class="tabs-search">
      <FilterQueryForm
        :fAttr="{'label-width': '80px'}"
        :resetBtnVisible="false"
        :searchBtnVisible="true"
        :model="fqForm"
        @afterFilter="handleFilter($event, getSysUserList)"
      ></FilterQueryForm>
    </div>
    <div class="dashboard-content">
      <div class="organization">
        <div class="zzBox">
          <span>组织结构</span>
          <div class="revise">
            <router-link to="/system/dept">
              <i class="comm revised"></i>
            </router-link>
            <i class="comm refresh"></i>
            <i class="comm select"></i>
          </div>
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="table-content">
        <div class="tableHead">
          <div class="button" @click="dialogFormVisible = true">新增</div>
          <div class="button" @click="batchDelete">删除</div>
          <div class="button" @click="revise">修改</div>
          <div class="button">导入</div>
          <div class="button" @click="exported">导出</div>
          <div class="operation">
            <div @click="toggle">
              <span></span>
            </div>
            <div @click="getSysUserList">
              <span></span>
            </div>
            <div>
              <span></span>
            </div>
            <div>
              <span></span>
            </div>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="tableDataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户ID" prop="surUserId" width="120"></el-table-column>
            <el-table-column prop="surLoginName" label="登录名称" width="120"></el-table-column>
            <el-table-column prop="surUserName" label="用户名称"></el-table-column>
            <el-table-column prop="surDeptId" label="部门"></el-table-column>
            <el-table-column prop="surPhoneNumber" label="手机"></el-table-column>
            <el-table-column label="用户状态" width="120">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.surStatus"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="surCreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <span @click="editor(scope.row)">编辑</span>
                <span @click="deleted(scope.row.surUserId)">删除</span>
                <span @click="resetPassword(scope.row)">重置</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          style="text-align:right;margin-top:2%;"
          background
          layout="prev, pager, next, jumper,total"
          @size-change="handleSizeChange($event, query)"
          @current-change="handleCurrentChange($event, query)"
          :current-page="queryList.pageNum"
          :page-size="queryList.pageSize"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="基本信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="height:308px;">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.surUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="归属部门" :label-width="formLabelWidth">
          <el-input v-model="form.surDeptId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.surPhoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" :label-width="formLabelWidth">
          <el-input v-model="form.surEmail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录帐号" :label-width="formLabelWidth">
          <el-input v-model="form.surLoginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form.surPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" :label-width="formLabelWidth">
          <el-radio v-model="form.surSex" label="1">男</el-radio>
          <el-radio v-model="form.surSex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-switch v-model="value1"></el-switch>
        </el-form-item>
        <el-form-item label="岗 位" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择岗位">
            <el-option label="董事长" value="董事长"></el-option>
            <el-option label="项目经理" value="项目经理"></el-option>
            <el-option label="人力资源" value="人力资源"></el-option>
            <el-option label="普通员工" value="普通员工"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角 色" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">操作员</el-radio>
          <el-radio v-model="radio" label="2">管理员</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="textarea">
          <span>活动形式</span>
          <input type="textarea" v-model="form.surRemark" />
        </div>
        <el-button type="primary" @click="preservation">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="dialogFormVisiblePassword">
      <el-form :model="passWordForm" style="height:308px;">
        <el-form-item label="登录名称" :label-width="formLabelWidth">
          <el-input v-model="passWordForm.surLoginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="输入密码" :label-width="formLabelWidth">
          <el-input v-model="passWordForm.surPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="preservationpassWord" type="primary">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisiblePassword = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSysUserList,
  getSysDeptTreeData,
  deleteUserGwPage,
  postresetPwd,
  getSysUserAdd
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      fqForm: [
        {
          fiAttr: {
            label: "登录名称"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "surLoginName"
        },
        {
          fiAttr: {
            label: "手机号码"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "surPhoneNumber"
        },
        {
          fiAttr: {
            label: "用户状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "surStatus",
          option: [{ label: "正常", value: 0 }, { label: "禁用", value: 1 }]
        }
        // {
        //   fiAttr: {
        //     label: "创建时间"
        //   },
        //   el: "date-picker",
        //   bindkey: "surStatus"
        // }
      ],
      tableData: [],
      value1: true,
      multipleSelection: [],

      //   sizeForm: {
      //     surLoginName: "",
      //     surPhoneNumber: "",
      //     surStatus: "",
      //     surBeginTime: "",
      //     surEndTime: ""
      //   },

      //   queryList: {
      // 	current: 1,
      // 	pageSize: 10,
      //   },
      passWordForm: {
        surUserId: "",
        surPassword: ""
      },
      radio: "1",
      surSex: "1",
      surStatus: "1",
      dialogFormVisible: false,
      dialogFormVisiblePassword: false,
      formLabelWidth: "120px",
      isSearch: true,
      pageShow: true,
      data: [],
      form: {
        surDeptId: "",
        surLoginName: "",
        surUserName: "",
        surEmail: "",
        surPhoneNumber: "",
        surSex: "",
        surPassword: "",
        surRemark: "",
        surSex: "1"
      },
      defaultProps: {
        children: "children",
        label: "sdtDeptName"
      }
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {
    query() {
      return this.doQuery.bind(this, getSysUserList);
    }
  },
  created() {
    this.query();
    getSysDeptTreeData().then(res => {
      this.data = res;
    });
  },
  methods: {
    handleClick(row) {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    preservation() {
      this.dialogFormVisible = false;
      console.log(this.form);
      getSysUserAdd(this.form).then(res => {
        this.$message({
          type: "success",
          message: "新增成功!"
        });
      });
    },
    exported() {
      //导出
      window.location.href =
        "http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel";
    },
    batchDelete() {
      //批量删除
      console.log(this.multipleSelection);
      let selectArr = [];
      if (typeof this.multipleSelection == "undefined") {
        this.$message({
          message: "请选择需要删除的数据！",
          type: "warning"
        });
      } else {
        this.multipleSelection.forEach((v, i) => {
          selectArr.push(v.surUserId);
        });
        this.deleted(selectArr.join(","));
      }
    },
    resetPassword(row) {
      //重置
      console.log(row);
      this.dialogFormVisiblePassword = true;
      this.passWordForm = row;
    },
    preservationpassWord() {
      console.log(this.passWordForm.surPassword);
      console.log(this.passWordForm.surUserId);
      postresetPwd({
        password: this.passWordForm.surPassword,
        surUserId: this.passWordForm.surUserId
      }).then(res => {
        this.$message({
          type: "success",
          message: "重置成功!"
        });
      });
    },
    revise() {
      if (typeof this.multipleSelection == "undefined") {
        this.$message({
          message: "请选择需要修改的数据！",
          type: "warning"
        });
      } else {
        this.dialogFormVisible = true;
        this.form = this.multipleSelection.pop(); //获取最后一条
        this.obj = this.multipleSelection.pop();
      }
    },
    deleted(ids) {
      //删除
      this.$confirm("确认删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUserGwPage({ ids: ids }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.queryDate();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editor(rows) {
      //编辑
      this.dialogFormVisible = true;
      this.form = rows;
      this.obj = rows;
    },
    getSysUserList() {
      getSysUserList(this.queryList).then(res => {
        this.total = +res.total;
        this.tableData = res.rows;
      });
    },
    toggle() {
      //显示隐藏查询切换
      this.isSearch = !this.isSearch;
    },
    handleNodeClick(data) {}
  }
};
</script>
<style lang="scss" scoped>
.user {
  color: #fff;
  height: 100%;
  .dashboard-content {
    height: calc(100% - 174px);
    width: 100%;
    display: flex;
    margin-top: 15px;
    .organization {
      width: 223px;
      height: 100%;
      background: url(../../assets/images/organization-bg.png);
      background-size: 100% 100%;
      padding: 22px;
      box-sizing: border-box;
      .zzBox {
        width: 100%;
        margin-bottom: 14px;
        span {
          color: #fff;
          font-size: 14px;
        }
        .revise {
          width: 47%;
          display: inline-block;
          float: right;
          .comm {
            display: inline-block;
            width: 18px;
            height: 18px;
            background: url(../../assets/images/revise.png);
            background-size: 100% 100%;
            vertical-align: middle;
            margin-right: 10%;
            cursor: pointer;
          }
          .revised {
            background: url(../../assets/images/refresh.png);
          }
          .select {
            background: url(../../assets/images/select.png);
          }
        }
      }
    }
    .table-content {
      width: calc(100% - 239px);
      height: 100%;
      margin-left: 16px;
      background: url(../../assets/images/table-content-bg.png);
      background-size: 100% 100%;
      padding: 22px 34px;
      box-sizing: border-box;
      .tableHead {
        height: 70px;
        .button {
          width: 90px;
          height: 36px;
          line-height: 36px;
          background: #05254b;
          margin-right: 20px;
          float: left;
          border-radius: 4px;
          text-align: right;
          padding-right: 20px;
          cursor: pointer;
        }
        .button::before {
          content: "";
          width: 14px;
          height: 14px;
          display: inline-block;
          background-image: url(../../assets/icon.png);
          background-position: -57px 792px;
          margin-right: 6px;
        }
        .button:nth-child(2):before {
          background-position: -57px 770px;
        }

        .button:nth-child(3):before {
          background-position: -57px 749px;
        }
        .button:nth-child(4):before {
          background-position: -57px 726px;
        }
        .button:nth-child(5):before {
          background-position: -57px 704px;
        }
        .operation {
          width: 210px;
          height: 36px;
          background: #05254b;
          border: 1px solid #02439d;
          float: right;
          display: flex;
          div {
            width: 25%;
            height: 28px;
            margin-top: 4px;
            position: relative;
            cursor: pointer;
            span {
              width: 14px;
              height: 14px;
              display: inline-block;
              background-image: url(../../assets/icon.png);
              background-position: -57px 422px;
              position: absolute;
              left: 50%;
              margin-left: -7px;
              top: 50%;
              margin-top: -7px;
            }
          }
          div::before {
            content: "";
            width: 1px;
            height: 28px;
            display: inline-block;
            background: linear-gradient(
              0deg,
              rgba(1, 84, 199, 0) 0%,
              rgba(1, 84, 199, 1) 42%,
              rgba(1, 84, 199, 0) 100%
            );
          }
          div:nth-child(1):before {
            width: 0;
          }
          div:nth-child(2) span {
            background-position: -57px 376px;
          }
          div:nth-child(3) span {
            background-position: -57px 331px;
          }
          div:nth-child(4) span {
            background-position: -57px 288px;
          }
        }
      }
      .table {
        width: 100%;
        height: calc(100% - 165px);
        overflow: auto;
      }
    }
  }
}
.login-user {
  margin-bottom: 20px;
  text-align: center;
  span {
    text-align: center;
    font-size: 18px;
    color: #63acdf;
    margin: 0 5%;
  }
  img {
    vertical-align: bottom;
  }
}
.el-dialog {
  .el-dialog__header {
    text-align: center;
    .el-dialog__title {
      text-align: center;
      color: #4baefd;
    }
    .el-dialog__title:before {
      content: "";
      display: inline-block;
      background-image: url(../../assets/login-left.png);
      background-size: 100% 100%;
      width: 91px;
      height: 13px;
      margin-right: 12px;
    }
    .el-dialog__title:after {
      content: "";
      display: inline-block;
      background-image: url(../../assets/login-right.png);
      background-size: 100% 100%;
      width: 91px;
      height: 13px;
      margin-left: 12px;
    }
    .el-dialog__headerbtn {
      top: 80px;
      right: 80px;
      .el-dialog__close {
        color: #fff;
        font-size: 30px;
      }
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
    .el-form {
      padding: 20px 0px 0px;
      .el-radio {
        color: #fff;
        margin-right: 50px;
      }
    }
  }
}
.el-dialog__body::before {
  content: "基本信息";
  width: 100%;
  height: 34px;
  display: inline-block;
  border-bottom: 1px dashed rgba(75, 174, 253, 1);
  color: #63acdf;
  font-size: 13px;
}
.dialog-footer {
  text-align: center;
  .textarea {
    text-align: left;
    margin: 20px 0;
    span {
      margin-right: 22px;
    }
    input {
      width: 920px;
      height: 130px;
      background: rgba(5, 37, 75, 1);
      border: 1px solid rgba(2, 67, 157, 1);
      border-radius: 2px;
    }
  }
}
.el-dialog__footer::before {
  content: "其他信息";
  width: 100%;
  height: 34px;
  display: inline-block;
  border-bottom: 1px dashed rgba(75, 174, 253, 1);
  color: #63acdf;
  text-align: left;
  font-size: 13px;
}
</style>
<style>
.el-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 24px;
  height: 24px;
  vertical-align: middle;
}
.el-switch__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}
.el-switch.is-checked .el-switch__core {
  border-color: #4baefd;
  background-color: #4baefd;
}
.el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: not-allowed;
}
.el-switch__core {
  margin: 0;
  display: inline-block;
  position: relative;
  width: 50px !important;
  height: 24px;
  border: 1px solid #dcdfe6;
  outline: none;
  border-radius: 25px;
  box-sizing: border-box;
  background: #dcdfe6;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
  vertical-align: middle;
}
.el-switch.is-checked .el-switch__core:after {
  left: 88%;
  margin-left: -17px;
}
.el-switch__core:after {
  content: "";
  position: absolute;
  top: 0px;
  left: 1px;
  border-radius: 100%;
  transition: all 0.3s;
  width: 23px;
  height: 23px;
  background-color: #fff;
}
.cell span {
  cursor: pointer;
}
.cell span:nth-child(1) {
  color: #45eba7;
}
.cell span:nth-child(2) {
  color: #cb3203;
}
.cell span:nth-child(3) {
  color: #e6bf06;
}

*::-webkit-scrollbar {
  width: 16px;
}
*::-webkit-scrollbar-track {
  background-color: #05254b;
  border: 1px solid #02439d;
}

*::-webkit-scrollbar-thumb {
  background-color: #0154c7;
}
</style>
<style>
.el-input__inner {
  height: 30px !important;
}
.el-form-item__content {
  line-height: 30px !important;
}
/* x下拉框样式修改 */
.el-input__inner {
  background: transparent !important;
  border: none !important;
  color: #fff !important;
}
.el-input__inner::-webkit-input-placeholder {
  color: #fff !important;
}
.el-select-dropdown {
  background-color: transparent !important;
}
.el-select-dropdown__item {
  color: #fff !important;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: transparent !important;
  background: url(../../assets/head-select-hvoer.png);
  background-size: 100% 100%;
}
/* tree树样式修改 */
.el-tree {
  background: transparent;
  color: #4baefd;
}
.el-icon-caret-right:before {
  content: "el-icon-folder-add" !important;
}
.el-tree-node__content:hover {
  background-color: transparent;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: transparent;
}
/* 输入框样式修改 */
.el-form-item {
  width: 325px;
  color: #fff;
  float: left;
  margin-right: 112px;
  height: 38px;
}
.el-form-item:nth-child(4) {
  width: 325px;
}
.el-form-item:nth-child(4) .el-form-item__content div:nth-child(1) {
  width: 45%;
  float: left;
}
.el-form-item:nth-child(4) .el-form-item__content div:nth-child(2) {
  width: 10%;
  float: left;
  text-align: center;
}
.el-form-item:nth-child(4) .el-form-item__content div:nth-child(3) {
  width: 45%;
  float: left;
}
.el-form-item__label {
  float: left;
  font-size: 14px;
  line-height: 26px !important;
  color: #fff;
}
.el-form-item--large {
  width: 660px;
}
.el-button {
  margin-left: 514px;
  width: 120px;
  height: 35px;
  background: url(../../assets/buttonbg.png);
  background-size: 100% 100%;
  border: none;
  color: #fff;
}
.el-input__inner {
  background-color: #05254b !important;
  border: 1px solid #02439d !important;
}
.el-picker-panel {
  color: #606266;
  border: 1px solid #02439d;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #05254b;
  border-radius: 4px;
  line-height: 30px;
  margin: 5px 0;
}
.el-picker-panel__footer {
  border-top: 1px solid #e4e4e4;
  padding: 4px;
  text-align: right;
  background-color: #fff;
  position: relative;
  font-size: 0;
}
.el-popper[x-placement^="top"] .popper__arrow {
  bottom: -6px;
  left: 50%;
  margin-right: 3px;
  border-top-color: #ebeef5;
  border-bottom-width: 0;
}
.el-date-picker__header {
  margin: 12px;
  text-align: center;
}
.el-date-picker .el-picker-panel__content {
  width: 292px;
}
.el-picker-panel__content {
  position: relative;
  margin: 15px;
}
.el-date-picker table {
  table-layout: fixed;
  width: 100%;
}
.el-date-table {
  font-size: 12px;
  user-select: none;
}
.el-year-table {
  font-size: 12px;
  margin: -1px;
  border-collapse: collapse;
}
.el-month-table {
  font-size: 12px;
  margin: -1px;
  border-collapse: collapse;
}
.el-date-table td {
  width: 32px;
  height: 30px;
  padding: 4px 0;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
}
.el-date-table td.next-month,
.el-date-table td.prev-month {
  color: #c0c4cc;
}
.el-date-table td div {
  height: 30px;
  padding: 3px 0;
  box-sizing: border-box;
}
.el-date-table td span {
  width: 24px;
  height: 24px;
  display: block;
  margin: 0 auto;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}
.el-date-table td.today span {
  color: #fff;
  font-weight: 700;
}
.el-date-table td.available:hover {
  color: #409eff;
}
.el-date-table td.next-month,
.el-date-table td.prev-month {
  color: #dbdce3;
}
.el-date-picker__header-label,
.el-date-table th,
.el-date-table td,
.el-icon-arrow-right:before,
.el-icon-d-arrow-right:before,
.el-icon-d-arrow-left:before,
.el-icon-arrow-left:before {
  color: #4baefd;
}
.el-table__row td:last-child .cell span {
  padding: 10px;
}
</style>
