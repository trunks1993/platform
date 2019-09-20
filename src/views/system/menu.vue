<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="true"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterReset="queryDate"
      @afterFilter="handleFilter($event, query)"
    ></FilterQueryForm>
    <div class="app-wrapper">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="saveAskfather">新增</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
          <el-button type="tool" icon="el-icon-export">展开/折叠</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" row-key="menuId" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="菜单名称" prop="menuName" />
            <el-table-column label="排序" prop="orderNum" />
            <el-table-column label="资源路径" prop="component" />
            <el-table-column label="类型" prop="menuType" />
            <el-table-column label="可见" prop="visible" />
            <el-table-column label="权限标识" prop="perms" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row)">编辑</el-button>
                <el-button type="text" @click="saveAskhz(scope.row.surUserId)">新增</el-button>
                <el-button type="text-warn" @click="deleted(scope.row.menuId)">删除</el-button>
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
    <el-dialog title="基本信息" :visible.sync="dialogFormVisible">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" :inline="true">
        <el-form-item label="上级菜单" label-width="120px">
          <el-input v-model="form.parentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" label-width="120px">
          <el-input v-model="form.menuType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" label-width="120px">
          <el-input v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" label-width="120px">
          <el-input v-model="form.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" label-width="120px">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" label-width="120px">
          <el-input v-model="form.perms" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" label-width="120px">
          <el-input v-model="form.orderNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="120px">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" label-width="120px">
          <el-switch v-model="form.visible"></el-switch>
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
  </div>
</template>
<script>
import {
  getMenuTree,
  putMenuAdd,
  getMenuDelete,
  getMenuList,
  getQueryByList,
  putMenuEdit
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";

export default {
  mixins: [mixin],
  components: {
    FilterQueryForm
  },
  data() {
    return {
      baseExpApi:
        "http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel",
      fqForm: [
        {
          fiAttr: {
            label: "菜单名称"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "menuName"
        },
        {
          fiAttr: {
            label: "菜单状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "visible",
          option: [
            { label: "所有", value: "" },
            { label: "显示", value: 0 },
            { label: "隐藏", value: 1 }
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
      tableDataList: [],
      value1: true,
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
        parentId: "",
        menuName: "",
        systemId: "",
        parentId: "",
        orderNum: "",
        path: "",
        menuType: "",
        visible: "",
        perms: "",
        icon: "",
        component: ""
      },
      sizeForm: {
        menuName: "",
        visible: ""
      },
      dialogVisible: false,
      ids: "",
      isSearch: true
    };
  },
  computed: {
    query() {
      return this.doQuery.bind(this, getQueryByList);
    }
  },
  created() {
    this.queryDate();
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    toggleSelection(rows) {console.log(rows)
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    deleted(ids) {
      //删除
      this.dialogVisible = true;
      this.ids = ids;
    },
    sure() {
      //确认删除
      getMenuDelete({ menuId: this.ids }).then(res => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.dialogVisible = false;
        this.query();
      });
    },
    revise() {
      if (typeof this.multipleSelection == "undefined") {
        this.$message({
          message: "请选择需要修改的数据！",
          type: "warning"
        });
      } else {
        console.log(this.multipleSelection);
        this.dialogFormVisible = true;
        this.form = this.multipleSelection.pop(); //获取最后一条
        this.obj = this.multipleSelection.pop();
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    queryDate() {
      this.total = 1;
      getMenuList(this.sizeForm).then(res => {
        this.tableDataList = res;
      });
    },
    preservation() {
      if (JSON.stringify(this.obj) == "{}") {
        //新增
        this.addAsk();
      } else {
        //编辑
        this.saveAsk();
      }
    },
    addAsk() {
      this.form.visible = this.form.visible == true ? 0 : 1;
      putMenuAdd(this.form).then(res => {
        this.$message({
          type: "success",
          message: "新增成功!"
        });
        this.dialogFormVisible = false;
      });
    },
    saveAsk() {
      // console.log(this.form)
      this.form.visible = this.form.visible == true ? 0 : 1;
      // this.form.systemId = this.form.systemId;
      let obj = {
        menuId: this.form.menuId,
        parentId: this.form.parentId,
        menuName: this.form.menuName,
        systemId: this.form.systemId,
        parentId: this.form.parentId,
        orderNum: this.form.orderNum,
        path: this.form.path,
        menuType: this.form.menuType,
        visible: this.form.visible,
        perms: this.form.perms,
        icon: this.form.icon,
        component: this.form.component
      };
      console.log(this.form);
      putMenuEdit(obj).then(res => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.dialogFormVisible = false;
      });
    },
    saveAskfather() {
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    saveAskhz(rows) {
      this.dialogFormVisible = true;
      this.form.parentId = rows.menuId;
      this.obj = {};
    },
    editor(rows) {
      console.log(rows);
      //编辑
      this.dialogFormVisible = true;
      this.form = rows;
      this.obj = rows;
    }
  }
};
</script>
