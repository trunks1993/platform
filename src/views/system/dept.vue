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
            style="width: 100%;margin-bottom: 20px;"
            row-key="sdtDeptId"
            @selection-change="handleSelectionChange"
            ref="tableTree"
            :default-expand-all="isExpand"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="selection"></el-table-column>
            <!-- <el-table-column
              v-for="(item,index) in tableList"
              :key="index"
              :label="item.label"
              :prop="item.prop"
            ></el-table-column>-->
            <el-table-column label="菜单名称" prop="sdtDeptName"></el-table-column>
            <el-table-column prop="sdtDelFlag" label="排序"></el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  :class="[scope.row.sdtStatus == '0'  ? 'normal' : 'stop']"
                >{{scope.row.sdtStatus == '0' ? '正常' : '停用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sdtCreateTime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row, true)">编辑</el-button>
                <el-button type="text-warn" @click="editor(scope.row)">新增</el-button>
                <el-button type="text-danger" @click="deleted(scope.row.sdtDeptId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="handleFormDlogClose.bind(null, 'editForm')">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form"  ref="editForm" :inline="true">
        <el-form-item label="上级部门：" :label-width="'120px'"  prop="sdtDeptPid">
          <el-input v-model="form.sdtDeptPid" @focus="sectoralChoice = true"></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" :label-width="'120px'"  prop="sdtDeptName">
          <el-input v-model="form.sdtDeptName"></el-input>
        </el-form-item>
        <el-form-item label="显示排序：" :label-width="'120px'"  prop="sdtOrderNum">
          <el-input v-model="form.sdtOrderNum"></el-input>
        </el-form-item>
        <el-form-item label="负责人：" :label-width="'120px'"  prop="sdtLeader">
          <el-input v-model="form.sdtLeader"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" :label-width="'120px'"  prop="sdtPhone">
          <el-input v-model="form.sdtPhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" :label-width="'120px'"  prop="sdtEmail">
          <el-input v-model="form.sdtEmail"></el-input>
        </el-form-item>
        <el-form-item label="部门状态" :label-width="'120px'">
          <el-radio v-model="form.sdtStatus" label="0">正常</el-radio>
          <el-radio v-model="form.sdtStatus" label="1">停用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="handleSave" type="primary">保 存</el-button>
        <el-button type="primary"  @click="handleFormDlogClose('editForm', 'dialogFormVisible')">关 闭</el-button>
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
        <el-tree :data="data" :expand-on-click-node="false" :props="defaultProps" @node-click="data => nodeSelTemp = data"></el-tree>
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
  getSysDeptTreeData,
  searchSysDeptList,
  postSysDeptAdd,
  deleteSysDeptRomove,
  putSysDeptEdit,
  getSysDeptEdit
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
            label: "部门名称"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "sdtDeptName"
        },
        {
          fiAttr: {
            label: "部门状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "sdtStatus",
          option: {
            url:
              "/v1/dictionaries/dictData/selectByDictType?dictType=sys_dept_status",
            labelKey: "dictLabel",
            valueKey: "dictValue"
          }
        }
      ],
      tableList: [
        {
          label: "菜单名称",
          prop: "sdtDeptName"
        },
        {
          label: "排序",
          prop: "sdtDelFlag"
        },
        {
          label: "状态",
          prop: "sdtStatus"
        },
        {
          label: "创建时间",
          prop: "sdtCreateTime"
        }
      ],
      form: {
        sdtDeptPid: "",
        sdtDeptName: "",
        sdtOrderNum: "",
        sdtLeader: "",
        sdtPhone: "",
        sdtEmail: "",
        sdtStatus: "1"
      },
      bmId: "",
      type: 0,
      tableData: [],
      '120px': "120px",
      dialogFormVisible: false,
      sectoralChoice: false,
      value1: true,
      multipleSelection: [],
      sizeForm: {
        sdtStatus: "",
        sdtDeptName: ""
      },
      defaultProps: {
        children: "children",
        label: "sdtDeptName"
      },
      dialogVisible: false,
      ids: "",
      data: [],
      dialogVisible: false,
      ids: "",
      sdtDeptNameId:"",
      nodeSelTemp: '',
      isExpand: true
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {
    query() {
      return this.doQuery.bind(this, getSysDeptTreeData);
    },
    querySearch() {
      return this.doQuery.bind(this, searchSysDeptList);
    }
  },
  created() {
    this.query();
    this.queryDate();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onSubmit() { //输入框搜索
      console.log(this.sizeForm);
      searchSysDeptList(this.sizeForm).then(res => {
        this.tableDataList = res;
        console.log(this.tableData);
      });
    },
    queryDate() {
      //获取分页数据
      getSysDeptTreeData().then(res => {
        this.data = res;
      });
    },
    reset() {
      //重置输入框数据
      this.sizeForm.sdtDeptName = "";
      this.sizeForm.sdtStatus = "";
    },
    revise() {
      //批量修改
      this.type = 1;
      if (
        typeof this.multipleSelection == "undefined" ||
        this.multipleSelection.length == 0
      ) {
        this.$message({
          message: "请选择需要修改的数据！",
          type: "warning"
        });
      } else {
        console.log(this.multipleSelection);
        this.dialogFormVisible = true;
        let rows = this.multipleSelection.pop(); //获取最后一条
        this.editor(rows,true);
      }
    },
    deleted(ids) {
      //删除
      this.dialogVisible = true;
      this.ids = ids;
    },
    sure() {
      //确认删除
      deleteSysDeptRomove({ sdtDeptId: this.ids }).then(res => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.dialogVisible = false;
       this.query();
      });
    },
    handleNodeClick(data) { //部门选择树
      this.form.sdtDeptPid = data.sdtDeptName;
      this.bmId = data.sdtDeptId;
    },
    handleUnfold(){ //展开折叠
      const arr = [...document.getElementsByClassName("el-table__expand-icon")];
      arr.forEach(item=>{
        item.click();
      })
    },
    editor(rows, isEditor) {
      console.log(rows, isEditor)
      this.dialogFormVisible = true;
      this.isEditor = isEditor;
      if(isEditor){
        getSysDeptEdit(rows.sdtDeptId).then(res=>{
          this.form = res
        })
      }else {
          this.form.sdtDeptPid = rows.sdtDeptId;
      }
    },
    handleSave() {
      const requestApi = this.isEditor ? putSysDeptEdit : postSysDeptAdd;
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
    handleNodeSelect() {
      console.log(_.clone(this.nodeSelTemp))
      this.form.sdtDeptPid = _.clone(this.nodeSelTemp).sdtDeptId;
      this.nodeSelTemp = '';
      this.sectoralChoice = false;
    }
  }
};
</script>

