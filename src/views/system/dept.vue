<template>
  <div class="dept">
    <div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="部门名称">
						<el-input v-model="sizeForm.sdtDeptName"></el-input>
					</el-form-item>
					<el-form-item label="部门状态">
						<el-select v-model="sizeForm.sdtStatus" placeholder="所有"  style="width:245px;">
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
    </div>
    <!-- <div class="tabs-search" v-if="isSearch">
      <FilterQueryForm
        :fAttr="{'label-width': '80px'}"
        :resetBtnVisible="false"
        :searchBtnVisible="true"
        :model="fqForm"
        @afterFilter="handleFilter($event, query)"
      ></FilterQueryForm>
    </div> -->
    <div class="dashboard-content">
      <div class="table-content">
        <div class="tableHead">
          <div class="button" @click="addInfo">新增</div>
          <div class="button" @click="revise">修改</div>
          <div class="button">展开/折叠</div>
          <div class="operation">
            <div>
              <span></span>
            </div>
            <div>
              <span></span>
            </div>
            <div>
              <span></span>
            </div>
            <div>
              <span></span>
            </div>
          </div>
        </div>
        <div class="table">
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
            ></el-table-column> -->
            <el-table-column label="菜单名称" prop="sdtDeptName"></el-table-column>
            <el-table-column prop="sdtDelFlag" label="排序"></el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span :class="[scope.row.sdtStatus == '0'  ? 'normal' : 'stop']">{{scope.row.sdtStatus == '0' ? '正常' : '停用'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sdtCreateTime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span @click="editor(scope.row)">编辑</span>
                <span @click="deptAdd(scope.row)">新增</span>
                <span @click="deleted(scope.row.sdtDeptId)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="基本信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="height:308px;">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="preservation" type="primary">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
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
      type:0,
      tableData: [],
      formLabelWidth: "120px",
      dialogFormVisible: false,
      value1: true,
      multipleSelection: [],
      sizeForm: {
        sdtStatus: "",
        sdtDeptName: ""
      },
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
    queryDate() { //获取分页数据
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
       if(JSON.stringify(this.obj) == '{}'){//新增
                this.addAsk();
         }else{//编辑
                this.saveAsk();
         }  
    },
    addAsk(){
      //新增保存
      postSysDeptAdd(this.form).then(res => {
        this.$message({
          type: "success",
          message: "新增成功!"
        });
        this.dialogFormVisible = false;
      });
    },
    saveAsk(){
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
    addInfo(){
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    deptAdd(rows){ //具体行新增
      this.dialogFormVisible = true;
      this.form.sdtDeptPid = rows.sdtDeptId;
      this.obj = {};
    },
    revise(){//批量修改
        this.type = 1;
        if(typeof(this.multipleSelection) == "undefined"){
            this.$message({
                message: '请选择需要修改的数据！',
                type: 'warning'
            });
        }else{
          console.log(this.multipleSelection)
            this.dialogFormVisible = true;
            this.form = this.multipleSelection.pop();//获取最后一条
            this.obj = this.multipleSelection.pop();
        }
    },
    deleted(ids) {
      //删除
      this.$confirm("确认删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSysDeptRomove({ sdtDeptId: ids }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.queryDate();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

