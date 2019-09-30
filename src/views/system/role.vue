<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="true"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterFilter="handleFilter($event, query)"
      @handleVisible="e => filterVisible = e"
    ></FilterQueryForm>
    <div class="app-wrapper" :style="{height: filterVisible ? 'calc(100% - 115px)': 'calc(100% - 40px)'}">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="editor({},false)">新增</el-button>
          <el-button type="tool" icon="el-icon-close" @click="batchDelete">删除</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
          <!-- <el-button type="tool" icon="el-icon-export" @click="handleExport(baseExpApi)">导出</el-button> -->
        </div>
        <div class="content-box-table">
          <el-table
            ref="multipleTable"
            :data="tableDataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="角色编号" prop="roleId"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column prop="roleKey" label="权限字符"></el-table-column>
            <el-table-column prop="roleSort" label="显示顺序" show-overflow-tooltip></el-table-column>
            <el-table-column label="角色状态" width="120">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status"  @change="editorStatus(scope.row)"  active-value="0" inactive-value="1"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row,true)">编辑</el-button>
                <el-button type="text" @click="editdialog(scope.row)">数据权限</el-button>
                <el-button type="text-warn" @click="assignUsers(scope.row)">分配用户</el-button>
                <el-button type="text-danger" @click="deleted(scope.row.roleId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content-box-pagination">
          <el-pagination
            style="text-align:right;margin-top:2%;"
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
    <el-dialog :visible.sync="dialogFormVisible"  :before-close="handleFormDlogClose.bind(null, 'editForm')" @close="close">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" :inline="true" :rules="rules" ref="editForm" style="max-height: 400px; overflow: auto;">
        <el-form-item label="角色名称：" label-width="120px" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="权限字符：" label-width="120px" prop="roleKey">
          <el-input v-model="form.roleKey"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序：" label-width="120px" prop="roleSort">
          <el-input v-model="form.roleSort"></el-input>
        </el-form-item>
        <el-form-item label="状态：" label-width="120px" prop="status">
         <el-switch v-model="form.status" active-value="0" inactive-value="1" ></el-switch>
        </el-form-item>
        <el-form-item label="菜单权限" label-width="120px" >
          <el-tree
            :data="data"
            show-checkbox
            node-key="menuId"
            width="500px"
            ref="tree"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="treeSelectionDialog"
            @check-change="handleCheckChange"
            style="top: 7px;"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注：" label-width="120px"  prop="remark">
          <el-input v-model="form.remark" autocomplete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button  @click="handleSave" type="primary">保 存</el-button>
        <el-button type="primary" @click="handleFormDlogClose('editForm', 'dialogFormVisible')">关 闭</el-button>
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
    <!-- 数据权限 -->
    <el-dialog :visible.sync="editdialogVisible">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">数据权限</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="editForm" :inline="true" style="height: 400px; overflow: auto;">
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限字符" label-width="120px">
          <el-input v-model="editForm.roleKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据范围" prop="region" label-width="120px">
          <el-select v-model="editForm.dataScope" placeholder="请选择活动区域">
            <el-option label="全部数据权限" value="0"></el-option>
            <el-option label="自定数据权限" value="1"></el-option>
            <el-option label="本部门数据权限" value="2"></el-option>
            <el-option label="本部门及以下数据权限" value="3"></el-option>
            <el-option label="仅本人数据权限" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-if="editForm.dataScope == 1" label-width="120px">
            <el-tree
              :data="deptData"
              show-checkbox
              node-key="menuId"
              width="500px"
              ref="tree"
              highlight-current
              :props="defaultPropsTree"
              :default-checked-keys="treeSelection"
              @check-change="handleCheckChangeDept"
              style="top: 7px;"
            ></el-tree>
          </el-form-item>
        <!-- <el-form-item label="数据权限" prop="region">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-form-item>-->
      </el-form>
      <!-- </div> -->
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="sureEdit">确 定</el-button>
        <el-button type="primary" @click="editdialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSysRoleList,
  deleteRoleGwPage,
  putRoleAdd,
  putRoleEdit,
  getMenuList,
  getQueryByRoleId,
  getSysDeptTreeData 
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
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
          option: {
            url:
              "/v1/dictionaries/dictData/selectByDictType?dictType=sys_role_status",
            labelKey: "dictLabel",
            valueKey: "dictValue"
          }
        }
      ],
      data: [],
      deptData:[],
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      defaultPropsTree: {
        children: "children",
        label: "sdtDeptName"
      },
      editForm: {
        roleName: "",
        roleKey: "",
        dataScope: "",
        roleSort: "",
        status: "",
        remark: "",
        deptIds: "",
        roleId: ""
      },
      // value: 1,
      // valueF:false,
      multipleSelection: [],
      dialogFormVisible: false,
      filterVisible:true,
      editdialogVisible: false,
      sizeForm: {
        roleName: "",
        roleKey: "",
        status: "",
        remark: "",
        status: "",
        deptIds:[],
        roleId:"",
      },

      form: {
        roleName: "",
        roleKey: "",
        roleSort: "",
        status: "0",
        remark: "",
        dataScope: "",
      },
      rules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleKey:[
          { required: true, message: '请输入权限字符', trigger: 'blur' }
        ],
        roleSort:[
          { required: true, message: '请输入正确显示顺序', trigger: 'blur' },
        ],
      },
      pageShow: true,
      dialogVisible: false,
      ids: "",
      isSearch: true,
      deptIds: [],
      menuIds: [],
      treeSelection:[],
      treeSelectionDialog:[],
      handleData:"确定要删除列表数据吗？"
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {
    query() {
      return this.doQuery.bind(this, getSysRoleList);
    }
  },
  created() {
    this.query();
    getMenuList(this.sizeForm).then(res => {
      this.data = res;
    });
    getSysDeptTreeData().then(res => {
      this.deptData = res;
    });
  },
  methods: {
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
          selectArr.push(v.roleId);
        });
        this.deleted(selectArr.join(","));
      }
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
      this.form = rows;
      this.handleData = rows.status == 0 ? "确认要正常用户吗？": "确认要停用用户吗？";
    },
    sure() {
      console.log(this.ids)
      if(this.handleData == "确定要删除列表数据吗？"){
        deleteRoleGwPage({ roleIds: this.ids }).then(res => {
          let msgName = this.ids.length > 4 ? "批量删除成功!":"删除成功!"
          this.$message({
            type: "success",
            message: msgName
          });
          this.dialogVisible = false;
          this.query();
        });
      } else {
        delete(this.form["params"]);
        putRoleEdit(this.form).then(res => {  
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dialogVisible = false;
          this.query();
        })
      }
    },
    sureEdit() {
      this.editForm.deptIds = this.deptIds.toString();
      putRoleEdit(this.editForm).then(res => {
        this.$message({
          type: "success",
          message: "数据权限成功!"
        });
        this.editdialogVisible = false;
        this.deptIds = [];
        this.query();
      });
    },
    roleAdds() {
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    handleCheckChange() { //选择菜单
      let res = this.$refs.tree.getCheckedNodes();
      let arr = [];
      res.forEach(item => {
        arr.push(item.menuId);
      });
      this.menuIds = arr;
    },
    handleCheckChangeDept() { //选择部门
      let res = this.$refs.tree.getCheckedNodes();
      let arr = [];
      res.forEach(item => {
        arr.push(item.sdtDeptId);
      });
      this.deptIds = arr;
    },
    handleSave() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          const requestApi = this.isEditor ? putRoleEdit : putRoleAdd;
          this.form.menuIds = this.menuIds.toString();
          requestApi(this.form).then(res => {
            this.handleFormDlogClose('editForm', 'dialogFormVisible');
            let msgName = this.isEditor ? "修改成功!":"新增成功!";
            this.$message({
              type: "success",
              message: msgName
            });
            this.query();
            this.$refs.tree.setCheckedKeys([]);
          })
        } else {
          return false;
        }
      });
    },
    close(){
      this.$refs.tree.setCheckedKeys([]);
    },
    handleNodeClicks(data) {
      let sdtDeptId = parseInt(data.sdtDeptId);
      getSysUserList({
        surDeptId: sdtDeptId,
        pageNum: this.queryList.pageNum,
        pageSize: this.queryList.pageSize
      }).then(res => {
         this.tableDataList = res.rows;
      });
    },
    handleNodeClick(data) {
      this.form.surDeptId = data.sdtDeptId;
    },
    editor(rows, isEditor) {
      this.isEditor = isEditor;
      if(isEditor){
        getQueryByRoleId({roleId:rows.roleId}).then(res=>{
          this.form = _.pick(res, _.keys(this.form));
          let terrCheck = [];
          res.sysRoleMenus.forEach(item=>{
            terrCheck.push(item.menuId);
          })
          this.treeSelectionDialog = terrCheck;
        })
      }else {
        this.form.parentId = rows.menuId;
      }
      this.form.roleId = rows.roleId;
      this.dialogFormVisible = true;
    },
    // 数据权限
    editdialog(rows) {
      this.editForm = _.pick(rows, _.keys(this.editForm))
      this.editdialogVisible = true;
    },
    assignUsers(rows){ //分配用户
      this.$router.push({path:'/system/assignUsers',query:{roleId:rows.roleId}});
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

