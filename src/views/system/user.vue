<template>
  <div class="user">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="false"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterFilter="handleFilter($event, getSysUserList)"
    ></FilterQueryForm>

    <div class="app-wrapper" style="display: flex;">
      <div class="org-box">
        <!-- <div class="zzBox">
          <span>组织结构</span>
          <div class="revise">
            <i class="comm revised"></i>
            <i class="comm refresh"></i>
            <i class="comm select"></i>
          </div>
        </div> -->
        <div class="org-box-header">
          <label style="font-size: 14px;">组织机构</label>
        </div>
        
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>

      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
          <el-button type="tool" icon="el-icon-close">删除</el-button>
          <el-button type="tool" icon="el-icon-editor">修改</el-button>
          <el-button type="tool" icon="el-icon-import">导入</el-button>
          <el-button type="tool" icon="el-icon-export">导出</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" @selection-change="handleSelectionChange">
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
                <el-button type="text" @click="handleClick(scope.row)">查看</el-button>
                <el-button type="text">编辑</el-button>
                <el-button type="text-warn">重置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content-box-pagination">
          <el-pagination
            style="text-align:right;"
            background
            layout="prev, pager, next"
            @size-change="handleSizeChange($event, query)"
            @current-change="handleCurrentChange($event, query)"
            :current-page="queryList.pageNum"
            :page-size="queryList.pageSize"
            :total="total"
          ></el-pagination>
        </div>
      </div>

    </div>

    <el-dialog :visible.sync="dialogFormVisible">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt="">
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt="">
      </div>
      <el-form :model="form" :inline="true">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="归属部门" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录帐号" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">男</el-radio>
          <el-radio v-model="radio" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-switch v-model="value1"></el-switch>
        </el-form-item>
        <el-form-item label="岗 位" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择岗位">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗 位" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">操作员</el-radio>
          <el-radio v-model="radio" label="2">管理员</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSysUserList, getSysDeptTreeData } from "@/api";
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
      radio: "1",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      data: [],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
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
    handleNodeClick(data) {}
  }
};
</script>
<style lang="scss" scoped>
.user {
  color: #fff;
  height: 100%; 
}
.org-box {
  width: 223px;
  background: url(../../assets/images/org-bg.png);
  background-size: 100% 100%;
  padding: 20px;
  &-header {
    padding: 5px 0;
    margin-bottom: 20px;
    position: relative;
  }
}

.content-box {
  width: calc(100% - 238px);
  height: 100%;
  padding: 20px;
  margin-left: 15px;
  background: url(../../assets/images/table-content-bg.png);
  background-size: 100% 100%;
  &-tool {
    position: relative;
    height: 38px;
  }
  &-table {
    height: calc(100% - 148px);
    margin-top: 35px;
    overflow: auto;
  }
  &-pagination {
    margin-top: 35px;
    height: 32px;
  }
}
</style>

<style>
/* .el-input__inner {
  height: 30px !important;
}
.el-form-item__content {
  line-height: 30px !important;
} */
/* x下拉框样式修改 */
/* .el-input__inner {
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
} */

/* 输入框样式修改 */
/* .el-form-item {
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
} */
</style>
