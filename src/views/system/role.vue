<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="false"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterFilter="handleFilter($event, query)"
    ></FilterQueryForm>
    <div class="app-wrapper">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="roleAdds">新增</el-button>
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
                <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row)">编辑</el-button>
                <el-button type="text" @click="editdialog(scope.row)">数据权限</el-button>
                <el-button type="text-warn" @click="assignUsers(scope.row)">分配用户</el-button>
                <el-button type="text-warn" @click="deleted(scope.row.roleId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content-box-pagination">
          <el-pagination
            style="text-align:right;margin-top:2%;"
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
      <el-form :model="form" :inline="true" style="height: 400px; overflow: auto;">
        <el-form-item label="角色名称：" label-width="120px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限字符：" label-width="120px">
          <el-input v-model="form.roleKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序：" label-width="120px">
          <el-input v-model="form.roleSort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态：" label-width="120px">
         <el-switch v-model="form.status" active-value="0" inactive-value="1" ></el-switch>
        </el-form-item>
        <el-form-item label="菜单权限" label-width="120px">
          <el-tree
            :data="data"
            show-checkbox
            node-key="menuId"
            width="500px"
            ref="tree"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="treeSelection"
            @check-change="handleCheckChange"
            style="top: 7px;"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注：" label-width="120px">
          <el-input v-model="form.remark" autocomplete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="preservation" type="primary">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
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
  getMenuList
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
      data: [],
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
      value1: true,
      multipleSelection: [],
      dialogFormVisible: false,
      editdialogVisible: false,
      sizeForm: {
        roleName: "",
        roleKey: "",
        date1: "",
        date2: "",
        status: ""
      },
      form: {
        roleName: "",
        roleKey: "",
        roleSort: "",
        status: "",
        remark: "",
        dataScope: ""
      },
      pageShow: true,
      current: 1,
      pageSize: 5,
      dialogVisible: false,
      ids: "",
      total: 10,
      isSearch: true,
      deptIds: [],
      treeSelection:[],
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
      console.log(res);
      this.data = res;
    });
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
    //搜索按钮
    onSubmit() {
      console.log("submit!");
    },
    //重置按钮
    reset() {
      this.sizeForm.roleName = "";
      this.sizeForm.roleKey = "";
      this.sizeForm.date1 = "";
      this.sizeForm.date2 = "";
      this.sizeForm.status = "";
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
          selectArr.push(v.roleId);
        });
        this.deleted(selectArr.join(","));
      }
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
      deleteRoleGwPage({ roleIds: this.ids }).then(res => {
        console.log(res);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.dialogVisible = false;
        this.query();
      });
    },
    preservation() {
      // 新增保存
      if (JSON.stringify(this.obj) == "{}") {
        //新增
        this.addAsk();
      } else {
        //编辑
        this.saveAsk();
      }
    },
    addAsk() {
      this.form.deptIds = this.deptIds.toString();
      putRoleAdd(this.form).then(res => {
        this.$message({
          type: "success",
          message: "新增成功!"
        });
        this.dialogFormVisible = false;
        this.query();
      });
    },
    saveAsk() {
      this.form.deptIds = this.deptIds.toString();
      let obj = {
        roleName: this.form.roleName,
        roleKey: this.form.roleKey,
        roleSort: this.form.roleSort,
        status: this.form.status,
        remark: this.form.remark,
        deptIds: this.form.deptIds,
        roleId: this.form.roleId
      };
      console.log(this.form);
      putRoleEdit(obj).then(res => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.dialogFormVisible = false;
        this.query();
      });
    },
    sureEdit() {
      putRoleEdit(this.editForm).then(res => {
        this.$message({
          type: "success",
          message: "数据权限成功!"
        });
        this.editdialogVisible = false;
        this.query();
      });
    },
    handleSizeChange: function(current) {
      console.log(current);
      this.current = current;
      this.queryDate();
    },

    roleAdds() {
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    editor(rows) {
      //编辑
      this.dialogFormVisible = true;
      this.treeSelection.push(Number(rows.dataScope));
      console.log(this.treeSelection)
      console.log(rows);
      this.form = rows;
      this.obj = rows;
    },
    // 权限
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([
        {
          id: 5,
          label: "二级 2-1"
        },
        {
          id: 9,
          label: "三级 1-1-1"
        }
      ]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    handleCheckChange() {
      // console.log(data);
      let res = this.$refs.tree.getCheckedNodes();
      let arr = [];
      res.forEach(item => {
        arr.push(item.menuId);
      });
      console.log(arr);
      this.deptIds = arr;
    },
    // 数据权限
    editdialog(rows) {
      this.editForm.roleName = rows.roleName;
      this.editForm.roleKey = rows.roleKey;
      this.editForm.roleSort = rows.roleSort;
      this.editForm.status = rows.status;
      this.editForm.remark = rows.remark;
      this.editForm.deptIds = rows.deptIds;
      this.editForm.roleId = rows.roleId;
      this.editdialogVisible = true;
    },
    handleNodeClick(data) {
      console.log(data);
      // this.form.surDeptId = data.sdtDeptName;
      // this.bmId = data.sdtDeptId;
    },
    assignUsers(rows){ //分配用户
      this.$router.push({path:'/system/assignUsers',query:{roleId:rows.roleId}});
    }
  }
};
</script>

