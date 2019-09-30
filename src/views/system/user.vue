<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="true"
      :searchBtnVisible="true"
      :model="fqForm"
      ref="search"
      @afterFilter="handleFilter($event, query)"
      @handleVisible="e => filterVisible = e"
      @queryChange="queryStatus"
    ></FilterQueryForm>

    <div class="app-wrapper" :style="{display: 'flex', height: filterVisible ? 'calc(100% - 115px)': 'calc(100% - 40px)'}">
      <div class="org-box">
        <div class="revise">
          <i @click="handleEditor" class="el-icon-editor"></i>
          <i @click="handleDown" class="el-icon-arrow-down"></i>
          <i @click="handleRefresh" class="el-icon-refresh"></i>
        </div>
        <div class="org-box-header">
          <label style="font-size: 14px;">组织机构</label>
        </div>

        <el-tree :data="data" :expand-on-click-node="false" :props="defaultProps" @node-click="handleNodeClicks"></el-tree>
      </div>
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="editor({},false)">新增</el-button>
          <el-button type="tool" icon="el-icon-close" @click="batchDelete">删除</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
          <el-button type="tool" icon="el-icon-export" @click="handleExport(baseExpApi,'用户管理')">导出</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" @selection-change="handleSelectionChange"  ref="multipleTable">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户ID" prop="surUserId" width="120"></el-table-column>
            <el-table-column prop="surLoginName" label="登录名称" width="120"></el-table-column>
            <el-table-column prop="surUserName" label="用户名称"></el-table-column>
            <el-table-column prop="dept.sdtDeptName" label="部门"></el-table-column>
            <el-table-column prop="surPhoneNumber" label="手机"></el-table-column>
            <el-table-column label="用户状态" width="120">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.surStatus" active-value="0" @change="editorStatus(scope.row)" inactive-value="1"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="surCreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row, true)">编辑</el-button>
                <el-button type="text-danger" @click="deleted(scope.row.surUserId)">删除</el-button>
                <el-button type="text-warn" @click="resetPassword(scope.row)">重置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content-box-pagination">
          <el-pagination
            style="text-align:right;"
            background
            layout="prev, pager, next, total"
            @size-change="handleSizeChange($event, query)"
            @current-change="handleCurrentChange($event, query)"
            :current-page="queryList.pageNum"
            :page-size="queryList.pageSize"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="handleFormDlogClose.bind(null, 'editForm')">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" :rules="rules" ref="editForm" :inline="true">
        <el-form-item label="用户名称" label-width="120px" prop="surUserName">
          <el-input v-model="form.surUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="归属部门" label-width="120px" prop="surDeptName">
          <el-input v-model="form.surDeptName" @focus="sectoralChoice = true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px" prop="surPhoneNumber">
          <el-input v-model="form.surPhoneNumber" type="tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="120px" prop="surEmail">
          <el-input v-model="form.surEmail" type="email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录帐号" label-width="120px" prop="surLoginName">
          <el-input v-model="form.surLoginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" v-if="!isEditor" label-width="120px" prop="surPassword">
          <el-input v-model="form.surPassword" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗 位" label-width="120px" prop="postIds">
          <el-select v-model="form.postIds" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.postId"
              :label="item.postName"
              :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户性别" label-width="120px">
          <el-radio v-model="form.surSex" label="1">男</el-radio>
          <el-radio v-model="form.surSex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="用户状态" label-width="120px" prop="surStatus">
          <el-switch v-model="form.surStatus" active-value="0" inactive-value="1"></el-switch>
        </el-form-item>
        <el-form-item label="角 色" label-width="120px" prop="roleIds">
          <el-checkbox-group v-model="form.roleIds" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="(item, index) in cities"
              :label="item.roleId"
              :key="index"
            >{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="handleSave('form')">保 存</el-button>
        <el-button type="primary" @click="handleFormDlogClose('editForm', 'dialogFormVisible')">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisiblespass">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">重置密码</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="passWordForm" :inline="true">
        <el-form-item label="登录名称：" label-width="120px">
          <el-input v-model="passWordForm.surLoginName" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="输入密码：" label-width="120px">
          <el-input v-model="passWordForm.surPassword" placeholder="请输入新的密码" type="password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="preservationpassWord">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisiblespass = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog :visible.sync="dialogVisible" @close='closeDialog'>
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">系统提示信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <div style="width:100%;color:#63ACDF;text-align:center;">{{handleData}}</div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="sure">确 定</el-button>
        <el-button type="primary" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 部门选择 -->
    <el-dialog :visible.sync="sectoralChoice">
      <div slot="title" class="dailog-title"  style="max-height: 400px; overflow: auto;">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">部门选择</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <div style="width:100%;color:#63ACDF;text-align:center;padding-left:100px;">
        <el-tree :data="data" :props="defaultProps" @node-click="data => nodeSelTemp = data"></el-tree>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="handleNodeSelect">确 定</el-button>
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
  getSelectByDictType,
  queryGwPage,
  getSysUserEdit,
  getSysRoleList
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
import md5 from 'js-md5';
export default {
  mixins: [mixin],
  data() {
      var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
      };
    return {
      baseExpApi: "/v1/api/user/SysUser/export",
      type: 0,
      fqForm: [
        {
          fiAttr: {
            label: "登录名称",
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
          option: {
            url:
              "/v1/dictionaries/dictData/selectByDictType?dictType=sys_user_status",
            labelKey: "dictLabel",
            valueKey: "dictValue"
          }
        }
      ],
      
      options: [],
      valuefox: [],
      cities: [],
      isIndeterminate: true,
      passWordForm: {
        surLoginName: "",
        surPassword: ""
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogFormVisiblespass: false,
      data: [],
      form: {
        surUserName: "",
        surDeptId: "",
        surDeptName:"",
        surPhoneNumber: "",
        surEmail: "",
        surLoginName: "",
        surPassword: "",
        resource: "",
        surStatus:"0",
        surSex: "1",
        form: "0",
        surUserId:"",
        postIds:[],
        roleIds:[],
      },

      rules:{
        surUserName:[
          { required: true, message: '请输入登录名称', trigger: 'blur' }
        ],
        surDeptName:[
          { required: true, message: '请选择归属部门', trigger: 'change' }
        ],
        surPhoneNumber:[
          {validator: checkPhone, trigger: 'blur'}
        ],
        surEmail:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        surLoginName:[
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        surPassword:[
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
      },
      handleData:"确定要删除列表数据吗？",
      defaultProps: {
        children: "children",
        label: "sdtDeptName"
      },
      sectoralChoice: false,
      dialogVisible: false,
      ids: "",
      isEditor:false,
      filterVisible: true,
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
    getSysDeptTreeData().then(res => { //部门树
      this.data = res;
    });
    queryGwPage({status:0}).then(res=>{ //岗位
      this.options = res.rows;
    })
    getSysRoleList().then(res=>{ //角色
      this.cities = res.rows;
    })
  },
  methods: {
    queryStatus(queryFilter){
    },
    handleEditor(){
      this.$router.push({path:'/system/dept'});
    },
    handleDown(){
      const arr = [...document.getElementsByClassName("el-tree-node__expand-icon")];
      arr.forEach(item=>{
        item.click();
      })
    },
    handleRefresh(){
      getSysDeptTreeData().then(res => { //部门树
        this.data = res;
      });
    },
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
    exported() {
      //导出
      window.location.href =
        "http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel";
    },
    batchDelete() {
      //批量删除
      let selectArr = [];
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message({
          message: "请选择需要删除的数据！",
          type: "warning"
        });
      } else {
        this.$refs.multipleTable.selection.forEach((v, i) => {
          selectArr.push(v.surUserId);
        });
        this.deleted(selectArr.join(","));
      }
    },
    resetPassword(row) {
      //重置
      this.dialogFormVisiblespass = true;
      this.passWordForm = row;
    },
    preservationpassWord() {
      postresetPwd({
        password: md5(this.passWordForm.surPassword),
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
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message({
          message: "请选择需要修改的数据！",
          type: "warning"
        });
      } else {
        if(this.$refs.multipleTable.selection.length > 1){
            this.$message({
                message: "只能选择一条数据进行修改",
                type: "warning"
            });
            return;
        }
        this.dialogFormVisible = true;
        let rows = this.$refs.multipleTable.selection.pop(); //获取最后一条
        this.editor(rows,true);
      }
    },
    deleted(ids) {
      //删除
      this.dialogVisible = true;
      this.ids = ids;
      this.handleData = "确定要删除列表数据吗？";
    },
    editorStatus(rows){ //开关按钮
      this.dialogVisible = true;
      let editRows = {};
      getSysUserEdit(rows.surUserId).then(res=>{
        editRows = res;
        res.roles.forEach((item)=>{
          editRows.roleIds.push(item.roleId);
        })
        res.posts.forEach((item)=>{
          editRows.postIds.push(item.postId);
        })
        this.form = _.pick(editRows, _.keys(this.form));
        this.form.roleIds = this.form.roleIds.toString();
        this.form.postIds = this.form.postIds.toString();
        this.form.surStatus = rows.surStatus;
        this.handleData = this.form.surStatus == 0 ? "确认要正常用户吗？": "确认要停用用户吗？";
      })
    },
    sure() {
      //确认删除
      if(this.ids.length){
        deleteUserGwPage({ ids: this.ids }).then(res => {
          let msgName = this.ids.length > 4 ? "批量删除成功!":"删除成功!"
          this.$message({
            type: "success",
            message: msgName
          });
          this.dialogVisible = false;
          this.query();
        });
        this.ids = "";
      } else {
        putUserEdit(this.form).then(res => {  
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dialogVisible = false;
          this.query();
        })
      }
    },
    handleSave() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          const requestApi = this.isEditor ? putUserEdit : getSysUserAdd;
          if(this.isEditor == undefined){
              this.form.surPassword = md5(this.form.surPassword);
          }
          this.form.roleIds = this.form.roleIds.toString();
          this.form.postIds = this.form.postIds.toString();
          requestApi(this.form).then(res => {
            this.handleFormDlogClose('editForm', 'dialogFormVisible');
            let msgName = this.isEditor ? "修改成功!":"新增成功!";
            this.$message({
              type: "success",
              message: msgName
            });
            this.query();
            this.form.roleIds = [];
            this.this.isEditor = false;
          })
        } else {
          return false;
        }
      });
    },
    handleNodeClicks(data) {

      let sdtDeptId = +data.sdtDeptId;
      const cloneQF = _.clone(this.$refs.search.queryFilter);
      _.assign(cloneQF, { surDeptId:sdtDeptId });
      this.handleFilter(cloneQF, this.query);
    },
    handleNodeSelect(data) {
      this.form.surDeptId = _.clone(this.nodeSelTemp).sdtDeptId;
      this.form.surDeptName = _.clone(this.nodeSelTemp).sdtDeptName;
      this.nodeSelTemp = '';
      this.sectoralChoice = false;
    },
    editor(rows, isEditor) {
      this.isEditor = isEditor;
      let editRows = {};
      if(this.isEditor){
        getSysUserEdit(rows.surUserId).then(res=>{
          editRows = res;
          res.roles.forEach((item)=>{
            editRows.roleIds.push(item.roleId);
          })
          res.posts.forEach((item)=>{
            editRows.postIds.push(item.postId);
          })
          this.form = _.pick(editRows, _.keys(this.form))

        })
      }else {
        this.form.surDeptId = this.data[0].sdtDeptId;
        this.form.surDeptName = this.data[0].sdtDeptName;
      }
      this.dialogFormVisible = true;
    },
    cancel(){
      this.dialogVisible = false;
      this.query();
    },
    closeDialog(){
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
  position: relative;
  &-header {
    padding: 5px 0;
    margin-bottom: 20px;
    position: relative;
  }
  .revise {
    width: 80px;
    height: 18px;
    position: absolute;
    top: 25px;
    right: 18px;
    padding-left: 20px; 
    z-index: 999;
    i {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
.content-box {
  width: calc(100% - 238px);
  margin-left: 15px;
}
</style>
<style lang="scss">
.el-tree-node {
  position: relative;
  padding-left: 0px;
}
.el-tree-node-children {
  padding-left: 0px;
}
.el-tree-node :last-child:before {
  height: 30px;
}
.el-tree>.el-tree-node:before {
  border-left: none;
}
.el-tree>.el-tree-node:after {
  border-top: none;
}
.el-tree-node:before,.el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.tree :first-child .el-tree-node:before {
  border-left: none;
}
.el-tree-node:before {
  border-left: 1px dashed #4386c6;
  bottom: 0px;
  height: 100%;
  top: -14px;
  width: 1px;
}
.el-tree-node:after {
  border-top: 1px dashed #4386c6;
  height: 20px;
  top: 15px;
  width: 16px;
}

.el-tree-node:focus > .el-tree-node__content > .el-tree-node__label {
  color: #ffffff !important;
}
</style>


