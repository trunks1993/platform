<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="false"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterFilter="handleFilter($event, query)"
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
        </div>-->
        <div class="org-box-header">
          <label style="font-size: 14px;">组织机构</label>
        </div>

        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClicks"></el-tree>
      </div>
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="roleAdds">新增</el-button>
          <el-button type="tool" icon="el-icon-close" @click="batchDelete">删除</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
          <!-- <el-button type="tool" icon="el-icon-import">导入</el-button> -->
          <el-button type="tool" icon="el-icon-export" @click="handleExport(baseExpApi)">导出</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户ID" prop="surUserId" width="120"></el-table-column>
            <el-table-column prop="surLoginName" label="登录名称" width="120"></el-table-column>
            <el-table-column prop="surUserName" label="用户名称"></el-table-column>
            <el-table-column prop="dept.sdtDeptName" label="部门"></el-table-column>
            <el-table-column prop="surPhoneNumber" label="手机"></el-table-column>
            <el-table-column label="用户状态" width="120">
              <template slot-scope="scope">
                <el-switch v-model="value1" v-if="scope.row.surStatus == 0"></el-switch>
                <el-switch v-else></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="surCreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleted(scope.row.surUserId)">删除</el-button>
                <el-button type="text-warn" @click="resetPassword(scope.row)">重置</el-button>
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
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" :inline="true">
        <el-form-item label="用户名称" label-width="120px">
          <el-input v-model="form.surUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="归属部门" label-width="120px">
          <el-input v-model="form.surDeptId" @focus="sectoralChoice = true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px">
          <el-input v-model="form.surPhoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="120px">
          <el-input v-model="form.surEmail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录帐号" label-width="120px">
          <el-input v-model="form.surLoginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" label-width="120px">
          <el-input v-model="form.surPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗 位" label-width="120px">
          <el-select v-model="postIds" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户性别" label-width="120px">
          <el-radio v-model="form.surSex" label="1">男</el-radio>
          <el-radio v-model="form.surSex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="用户状态" label-width="120px">
          <el-switch v-model="form.surStatus"></el-switch>
        </el-form-item>

        <el-form-item label="角 色" label-width="120px">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="(item, index) in cities"
              :label="item.key"
              :key="index"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="preservation">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisiblespass" @close="close">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">重置密码</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="passWordForm" :inline="true">
        <el-form-item label="登录名称：" label-width="120px">
          <el-input v-model="passWordForm.surLoginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="输入密码：" label-width="120px">
          <el-input v-model="passWordForm.surPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="preservationpassWord">保 存</el-button>
        <el-button type="primary" @click="close">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog :visible.sync="dialogVisible">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">系统提示信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <div style="width:100%;color:#63ACDF;text-align:center;">确定要删除列表数据吗？</div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="sure">确 定</el-button>
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 部门选择 -->
    <el-dialog :visible.sync="sectoralChoice">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">部门选择</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <div style="width:100%;color:#63ACDF;text-align:center;">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="sectoralChoice = false">确 定</el-button>
        <el-button type="primary" @click="sectoralChoice = false">取 消</el-button>
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
  getSysUserAdd,
  putUserEdit,
  getSelectByDictType
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      baseExpApi: "/v1/api/user/SysUser/export",
      type: 0,
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
          option: [
            { label: "所有", value: "" },
            { label: "正常", value: 0 },
            { label: "禁用", value: 1 }
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
      checkedCities: [],
      options: [
        {
          value: "1",
          label: "董事长"
        },
        {
          value: "2",
          label: "项目经理"
        },
        {
          value: "3",
          label: "人力资源"
        },
        {
          value: "4",
          label: "普通员工"
        }
      ],
      valuefox: [],
      cities: [{ name: "管理员", key: 0 }, { name: "操作员", key: 1 }],
      isIndeterminate: true,
      passWordForm: {
        surLoginName: "",
        surPassword: ""
      },
      tableData: [],
      value1: true,
      multipleSelection: [],
      radio: "1",
      dialogFormVisible: false,
      dialogFormVisiblespass: false,
      data: [],
      postIds: [],
      form: {
        surUserName: "",
        surDeptId: "",
        surPhoneNumber: "",
        surEmail: "",
        surLoginName: "",
        surPassword: "",
        resource: "",
        surSex: "0",
        form: "0"
      },
      defaultProps: {
        children: "children",
        label: "sdtDeptName"
      },
      bmId: "",
      sectoralChoice: false,
      dialogVisible: false,
      ids: ""
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
    getSelectByDictType({dictType:"sys_user_status"}).then(res=>{
      console.log(res)
    })
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    preservation(type) {
      console.log(this.postIds);
      console.log(this.checkedCities);
      if (JSON.stringify(this.obj) == "{}") {
        //新增
        this.addAsk();
      } else {
        //编辑
        this.saveAsk();
      }
      this.dialogFormVisible = false;
    },
    addAsk() {
      this.form.roleIds = this.checkedCities.toString();
      this.form.postIds = this.postIds.toString();
      this.form.surStatus = this.form.surStatus == true ? 0 : 1;
      this.form.surDeptId = this.bmId;
      getSysUserAdd(this.form).then(res => {
        this.$message({
          type: "success",
          message: "新增成功!"
        });
        this.query();
        this.form = {};
      });
    },
    saveAsk() {
      let status = this.form.surStatus == true ? 0 : 1;
      let roleIds = this.checkedCities.toString();
      let postIds = this.postIds.toString();
      let bmId = this.bmId;
      let obj = {
        surUserName: this.form.surUserName,
        surLoginName: this.form.surLoginName,
        surDeptId: bmId,
        surEmail: this.form.surEmail,
        surPhoneNumber: this.form.surPhoneNumber,
        surSex: this.form.surSex,
        surRemark: this.form.surRemark,
        roleIds: roleIds,
        postIds: postIds,
        surStatus: status,
        surUserId: this.form.surUserId
      };
      putUserEdit(obj).then(res => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.query();
        this.form = {};
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
      if (
        typeof this.multipleSelection == "undefined" ||
        this.multipleSelection.length == 0
      ) {
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
      this.dialogFormVisiblespass = true;
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
        this.dialogFormVisiblespass = false;
      });
    },
    revise() {
      if (
        typeof this.multipleSelection == "undefined" ||
        this.multipleSelection.length == 0
      ) {
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
      this.dialogVisible = true;
      this.ids = ids;
    },
    sure() {
      //确认删除
      deleteUserGwPage({ ids: this.ids }).then(res => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.dialogVisible = false;
        this.query();
      });
    },
    roleAdds() {
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    editor(rows) {
      //编辑
      console.log(rows);
      // this.checkedCities = rows.
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
    handleNodeClicks(data) {
      let sdtDeptId = parseInt(data.sdtDeptId);
      getSysUserList({
        surDeptId: sdtDeptId,
        pageNum: this.queryList.pageNum,
        pageSize: this.queryList.pageSize
      }).then(res => {
         this.tableDataList = res.rows;
      });
    },
    handleNodeClick(data) {
      this.form.surDeptId = data.sdtDeptName;
      this.bmId = data.sdtDeptId;
    },
    close(){ //关闭
      this.dialogFormVisiblespass = false;
      this.query();
    }
  }
};
</script>
<style lang="scss" scoped>
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
  margin-left: 15px;
}
</style>
