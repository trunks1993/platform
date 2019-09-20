<template>
  <div class="common-container">
    <div
      class="filter-container"
      style="height: 159px;background: url(../img/tabs-search-bg.e34485a0.png);background-size: 100% 100%;padding: 20px;"
    >
      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
        <el-form-item label="部门名称">
          <el-input v-model="sizeForm.sdtDeptName"></el-input>
        </el-form-item>
        <el-form-item label="部门状态">
          <el-select v-model="sizeForm.sdtStatus" placeholder="所有" style="width:245px;">
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-wrapper">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="addInfo">新增</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
          <el-button type="tool" icon="el-icon-export">展开/折叠</el-button>
        </div>
        <div class="content-box-table">
          <el-table
            :data="tableDataList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="sdtDeptId"
            @selection-change="handleSelectionChange"
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
                <el-button type="text" @click="editor(scope.row)">编辑</el-button>
                <el-button type="text" @click="deptAdd(scope.row)">新增</el-button>
                <el-button type="text-warn" @click="deleted(scope.row.sdtDeptId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
        <el-form-item label="上级部门：" :label-width="formLabelWidth">
          <el-input v-model="form.sdtDeptPid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" :label-width="formLabelWidth">
          <el-input v-model="form.sdtDeptName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示排序：" :label-width="formLabelWidth">
          <el-input v-model="form.sdtOrderNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人：" :label-width="formLabelWidth">
          <el-input v-model="form.sdtLeader" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" :label-width="formLabelWidth">
          <el-input v-model="form.sdtPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" :label-width="formLabelWidth">
          <el-input v-model="form.sdtEmail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门状态" :label-width="formLabelWidth">
          <el-radio v-model="form.sdtStatus" label="0">正常</el-radio>
          <el-radio v-model="form.sdtStatus" label="1">停用</el-radio>
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
  getSysDeptTreeData,
  searchSysDeptList,
  postSysDeptAdd,
  deleteSysDeptRomove,
  putSysDeptEdit
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
          bindKey: "roleName"
        },
        {
          fiAttr: {
            label: "部门状态"
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
      type: 0,
      tableData: [],
      formLabelWidth: "120px",
      dialogFormVisible: false,
      value1: true,
      multipleSelection: [],
      sizeForm: {
        sdtStatus: "",
        sdtDeptName: ""
      },
      dialogVisible: false,
      ids: "",
      isSearch: true
    };
  },
  components: {
    FilterQueryForm
  },
  created() {
    this.queryDate();
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
    onSubmit() {
      console.log(this.sizeForm);
      searchSysDeptList(this.sizeForm).then(res => {
        this.tableDataList = res;
        console.log(this.tableData);
      });
    },
    queryDate() {
      //获取分页数据
      getSysDeptTreeData().then(res => {
        this.tableDataList = res;
      });
    },
    reset() {
      //重置输入框数据
      this.sizeForm.sdtDeptName = "";
      this.sizeForm.sdtStatus = "";
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
      //新增保存
      postSysDeptAdd(this.form).then(res => {
        this.$message({
          type: "success",
          message: "新增成功!"
        });
        this.dialogFormVisible = false;
      });
    },
    saveAsk() {
      //修改保存
      putSysDeptEdit(this.form).then(res => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.dialogFormVisible = false;
      });
    },
    editor(rows) {
      //编辑
      this.dialogFormVisible = true;
      this.form = rows;
      this.obj = rows;
    },
    addInfo() {
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    deptAdd(rows) {
      //具体行新增
      this.dialogFormVisible = true;
      this.form.sdtDeptPid = rows.sdtDeptId;
      this.obj = {};
    },
    revise() {
      //批量修改
      this.type = 1;
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
    }
  }
};
</script>

