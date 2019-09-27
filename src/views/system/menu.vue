<template>
  <div class="common-container">

    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="true"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterReset="query"
      @afterFilter="handleFilter($event, querySearch)"
    ></FilterQueryForm>
    <div class="app-wrapper">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
          <el-button type="tool" icon="el-icon-export" @click="handleUnfold">展开/折叠</el-button>
        </div>
        <div class="content-box-table">
          <el-table
            :data="tableDataList"
            row-key="menuId"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="菜单名称" prop="menuName" />
            <el-table-column label="排序" prop="orderNum" />
            <el-table-column label="资源路径" prop="component" />
            <el-table-column label="路由" prop="path" />
            <el-table-column label="类型" >
              <span slot-scope="scope">
                {{scope.row.menuType | getMenuTypeName}}
              </span>
            </el-table-column>
            <el-table-column label="显示" prop="visible">
              <span slot-scope="scope">
                {{+scope.row.visible ? '隐藏' : '显示'}}
              </span>
            </el-table-column>
            <el-table-column label="权限标识" prop="perms" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row, true)">编辑</el-button>
                <el-button type="text-warn" @click="editor(scope.row)">新增</el-button>
                <el-button type="text-danger" @click="deleted(scope.row.menuId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="基本信息" :visible.sync="dialogFormVisible" :before-close="handleFormDlogClose.bind(null, 'editForm')">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" ref="editForm" :inline="true">
        <el-form-item label="上级菜单" label-width="120px" prop="parentId">
          <el-input v-model="form.parentId" @focus="sectoralChoice = true"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" label-width="120px" prop="menuType">
          <el-radio v-model="form.menuType" label="M">目录</el-radio>
          <el-radio v-model="form.menuType" label="C">菜单</el-radio>
          <el-radio v-model="form.menuType" label="F">按钮</el-radio>
        </el-form-item>
        <el-form-item label="菜单名称" label-width="120px" prop="menuName">
          <el-input v-model="form.menuName"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" label-width="120px" prop="component">
          <el-input v-model="form.component"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" label-width="120px" prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" label-width="120px" prop="perms">
          <el-input v-model="form.perms"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" label-width="120px" prop="orderNum">
          <el-input v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="120px" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" label-width="120px">
           <el-switch v-model="form.visible" active-value="0" inactive-value="1"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="handleSave" type="primary">保 存</el-button>
        <el-button type="primary" @click="handleFormDlogClose('editForm', 'dialogFormVisible')">关 闭</el-button>
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
        <span class="title">菜单选择</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <div style="width:100%;color:#63ACDF;text-align:center;">
        <el-tree :data="tableDataList" :expand-on-click-node="false" :props="defaultProps" @node-click="data => nodeSelTemp = data"></el-tree>
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
  getMenuTree,
  putMenuAdd,
  getMenuDelete,
  getMenuList,
  getQueryByList,
  putMenuEdit,
  getQueryByMenuId
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
import _ from 'lodash';

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
          option: {
            url:
              "/v1/dictionaries/dictData/selectByDictType?dictType=sys_menu_status",
            labelKey: "dictLabel",
            valueKey: "dictValue"
          }
        }
      ],
      tableDataList: [],
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
        parentId:"",
        menuType: "M",
        menuName: "",
        component: "",
        path: "",
        perms: "",
        orderNum: "",
        icon: "",
        visible: "0",
      },
      sizeForm: {
        menuName: "",
        visible: "",
      },
      nodeSelTemp: '',
      dialogVisible: false,
      sectoralChoice: false,
      ids: "",
      defaultProps: {
        children: "children",
        label: "menuName"
      }
    };
  },
  computed: {
    query() {
      return this.doQuery.bind(this, getMenuList);
    },
    querySearch() {
      return this.doQuery.bind(this, getQueryByList);
    }
  },
  created() {
    this.query();
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
      //修改
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
        let rows = this.multipleSelection.pop(); //获取最后一条
        this.editor(rows,true);
      }
    },
    handleUnfold(){ //展开折叠
      const arr = [...document.getElementsByClassName("el-table__expand-icon")];
      arr.forEach(item=>{
        item.click();
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSave() {
      const requestApi = this.isEditor ? putMenuEdit : putMenuAdd;
      requestApi(this.form).then(res => {
        this.handleFormDlogClose('editForm', 'dialogFormVisible');
        let msgName = this.isEditor ? "修改成功!":"新增成功!";
        this.$message({
          type: "success",
          message: msgName
        });
        this.query();
      })
    },
    editor(rows, isEditor) {
      this.dialogFormVisible = true;
      this.isEditor = isEditor;
     if(isEditor){
        getQueryByMenuId({menuId:rows.menuId}).then(res=>{
          this.form = _.pick(res, _.keys(this.form));
          this.form.menuId = rows.menuId;
        })
      }else {
          this.form.parentId = rows.menuId;
      }
    },
    handleNodeSelect() {
      this.form.parentId = _.clone(this.nodeSelTemp).menuId;
      this.nodeSelTemp = '';
      this.sectoralChoice = false;
    }
  }
};
</script>
