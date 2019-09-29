<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="true"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterReset="query"
      @afterFilter="handleFilter($event, querySearch)"
      @handleVisible="e => filterVisible = e"
    ></FilterQueryForm>
    <div class="app-wrapper" :style="{height: filterVisible ? 'calc(100% - 115px)': 'calc(100% - 40px)'}">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="editor({},false)">新增</el-button>
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
                  :style="{color:scope.row.sdtStatus == '0' ? '#45eba7' : '#cb3203'}"
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
      <el-form :model="form"  ref="editForm"  :rules="rules" :inline="true">
        <el-form-item label="上级部门：" :label-width="'120px'"  prop="sdtDeptPidName">
          <el-input v-model="form.sdtDeptPidName" @focus="sectoralChoice = true"></el-input>
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
      <div slot="title" class="dailog-title"  style="max-height: 400px; overflow: auto;">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">部门选择</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <div style="width:100%;color:#63ACDF;text-align:center;padding-left: 100px;">
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
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
      };
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
        sdtDeptPid: "1",
        sdtDeptPidName:"湖南分公司",
        sdtDeptName: "",
        sdtOrderNum: "",
        sdtLeader: "",
        sdtPhone: "",
        sdtEmail: "",
        sdtStatus: "1"
      },
      rules:{
        sdtDeptPid:[
          { required: true, message: '请选择上级部门', trigger: 'blur' }
        ],
        sdtDeptName:[
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        sdtLeader:[
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        sdtPhone:[
           {validator: checkPhone, trigger: 'blur'}
        ],
      },
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
      filterVisible:true,
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
      if (this.$refs.tableTree.selection.length == 0) {
        this.$message({
          message: "请选择需要修改的数据！",
          type: "warning"
        });
      } else {
        if(this.$refs.tableTree.selection.length > 1){
            this.$message({
                message: "只能选择一条数据进行修改",
                type: "warning"
            });
            return;
        }
        this.dialogFormVisible = true;
        let rows = this.$refs.tableTree.selection.pop(); //获取最后一条
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
          this.form.sdtDeptPidName = res.sdtDeptPidName;
        })
      }else {
          this.form.sdtDeptPid = rows.sdtDeptId;
      }
    },
    handleSave() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
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
        } else {
          return false;
        }
      });
    },
    handleNodeSelect() {
      this.form.sdtDeptPid = _.clone(this.nodeSelTemp).sdtDeptId;
      this.form.sdtDeptPidName = _.clone(this.nodeSelTemp).sdtDeptName;
      this.nodeSelTemp = '';
      this.sectoralChoice = false;
    }
  }
};
</script>

