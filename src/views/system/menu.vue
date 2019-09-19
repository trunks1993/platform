<template>
  <div class="menu">
    <!-- <div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="角色名称">
						<el-input v-model="sizeForm.name"></el-input>
					</el-form-item>
					<el-form-item label="角色状态">
						<el-select v-model="sizeForm.region" placeholder="所有"  style="width:245px;">
						<el-option label="显示" value="0"></el-option>
						<el-option label="隐藏" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item size="large">
						<el-button type="primary" @click="onSubmit">搜索</el-button>
						<el-button type="primary" @click="onSubmit">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
    </div>-->
    <div class="tabs-search" v-if="isSearch">
      <FilterQueryForm
        :fAttr="{'label-width': '80px'}"
        :resetBtnVisible="false"
        :searchBtnVisible="true"
        :model="fqForm"
        @afterFilter="handleFilter($event, query)"
      ></FilterQueryForm>
    </div>
    <div class="dashboard-content">
      <div class="table-content">
        <div class="tableHead">
          <div class="button"  @click="dialogFormVisible = true">新增</div>
          <div class="button">修改</div>
          <div class="button">展开/折叠</div>
          <div class="operation">
            <div>
              <span></span>
            </div>
            <div>
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
            :data="tableDataList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="menuId"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              v-for="(item,index) in tableList"
              :key="index"
              :label="item.label"
              :prop="item.prop"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span @click="handleClick(scope.row)">查看</span>
                <span>编辑</span>
                <span>重置</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="基本信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="height:308px;">
        <el-form-item label="角色名称：" :label-width="formLabelWidth">
          <el-input v-model="form.surLoginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限字符：" :label-width="formLabelWidth">
          <el-input v-model="form.surDeptId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序：" :label-width="formLabelWidth">
          <el-input v-model="form.surPhoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-radio v-model="form.surSex" label="1">男</el-radio>
          <el-radio v-model="form.surSex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input v-model="form.surUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" :label-width="formLabelWidth">
          <el-input v-model="form.surPassword" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-switch v-model="form.value1"></el-switch>
        </el-form-item>
        <el-form-item label="岗 位" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择岗位">
            <el-option label="董事长" value="董事长"></el-option>
            <el-option label="项目经理" value="项目经理"></el-option>
            <el-option label="人力资源" value="人力资源"></el-option>
            <el-option label="普通员工" value="普通员工"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="角色" :label-width="formLabelWidth">
					<el-radio v-model="surStatus" label="1">操作员</el-radio>
					<el-radio v-model="surStatus" label="2">管理员</el-radio>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="preservation" type="primary">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMenuTree } from "@/api";
export default {
  data() {
    return {
	 baseExpApi:
	 "http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel",
      fqForm: [
        {
          fiAttr: {
            label: "角色名称"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "roleName"
        },
        {
          fiAttr: {
            label: "权限字符"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "roleKey"
        },
        {
          fiAttr: {
            label: "角色状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "status",
          option: [
            { label: "所有", value: "" },
            { label: "正常", value: 0 },
            { label: "停用", value: 1 }
          ]
        }
        // {
        //   fiAttr: {
        //     label: "创建时间"
        //   },
        //   el: "date-picker",
        //   bindkey: "surStatus"
        // }
      ],
      tableList: [
        {
          label: "菜单名称",
          prop: "menuName"
        },
        {
          label: "排序",
          prop: "name"
        },
        {
          label: "请求地址",
          prop: "path"
        },
        {
          label: "类型",
          prop: "operator"
        },
        {
          label: "可见",
          prop: "state"
        },
        {
          label: "权限标识",
          prop: "state"
        }
      ],
      tableDataList: [],
      value1: true,
      multipleSelection: [],
      dialogFormVisible: false,
      formLabelWidth:'120px',
      form: {
        region: "",
        delivery: false,
        value1: true,
        surRemark: "",
        surUserName: "",
        surPhoneNumber: "",
        surRemark: "",
        surEmail: "",
        surLoginName: "",
        surPassword: "",
        surDeptId: ""
      },
      sizeForm: {
        name: "",
        region: ""
	  },
	  isSearch:true,
    };
  },
  created() {
  	this.queryDate();
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onSubmit() {
      this.queryDate();
    },
    queryDate() {
		   getMenuTree(this.sizeForm).then(res => {
			   console.log(res)
				this.tableDataList = res;
		   });
	  },
    preservation(){ //保存

    },
  }
};
</script>
<style lang="scss" scoped>
.menu {
  color: #fff;
  height: 100%;
  .tabs-search {
    height: 175px;
    margin-bottom: 12px;
    background-size: 100% 100%;
    .search {
      width: 100%;
      height: 150px;
      padding: 28px 20px;
    }
  }
  .dashboard-content {
    height: calc(100% - 187px);
    width: 100%;
    display: flex;
    .organization {
      width: 223px;
      height: 100%;
    }
    .table-content {
      width: 100%;
      height: 100%;
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
        .button:nth-child(3) {
          width: 130px;
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
.menu /deep/ .el-dialog {
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
  .el-dialog__body::before {
    content: "基本信息";
    width: 100%;
    height: 34px;
    display: inline-block;
    border-bottom: 1px dashed rgba(75, 174, 253, 1);
    color: #63acdf;
    font-size: 13px;
  }
}
.role /deep/ .dialog-footer {
  text-align: center;
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
.el-table_1_column_5 .cell {
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
.el-form-item {
  width: 325px;
  color: #fff;
  float: left;
  height: 60px;
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
  width: 450px !important;
}
.el-button {
  width: 120px;
  height: 35px;
  background: url(../../assets/buttonbg.png);
  background-size: 100% 100%;
  border: none;
  color: #fff;
  margin-left: 10px !important;
}
.el-button--primary:focus,
.el-button--primary:hover {
  border: none;
  background-color: transparent;
  background: url(../../assets/buttonbg.png);
  background-size: 100% 100%;
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
</style>

