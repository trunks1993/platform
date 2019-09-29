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
          :data="tableDataList"
          tooltip-effect="dark"
          style="width: 100%"
          ref="multipleTable"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="系统编号" prop="systemId"></el-table-column>
          <el-table-column label="系统名称" prop="systemName"></el-table-column>
          <el-table-column label="系统key" prop="systemKey"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button  type="text" @click="editor(scope.row, true)">编辑</el-button>
                 <el-button type="text-danger" @click="deleted(scope.row.systemId)">删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" :before-close="handleFormDlogClose.bind(null, 'editForm')" >
       <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt="">
        <span class="title">系统基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt="">
      </div>
      <el-form :rules="rules" :model="form" ref="editForm" :inline="true">
        <el-form-item label="系统编号" prop="systemId" :label-width="formLabelWidth" style="display:none">
          <el-input v-model="form.systemId" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="系统名称：" prop="systemName" :label-width="formLabelWidth">
          <el-input v-model="form.systemName" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="系统key：" prop="systemKey" :label-width="formLabelWidth">
          <el-input v-model="form.systemKey" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"  style="text-align: center;">
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
        <div style="width:100%;color:#63ACDF;text-align:center;">确定要删除选中的{{count.length}}条数据吗？</div>
        <div slot="footer" style="text-align: center;">
            <el-button type="primary" @click="sure">确 定</el-button>
            <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addSysData,
  editorSysData,
  querySysData,
  deleteSysData,
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
import _ from 'lodash';
export default {
  mixins: [mixin],
  data() {
    return {
      // baseExpApi: "/v1/manage/post/export",
      fqForm: [
        {
          fiAttr: {
            label: "系统编号"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "systemId"
        },
        {
          fiAttr: {
            label: "系统名称"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "systemName"
        }
        // {
        //   fiAttr: {
        //     label: "创建时间"
        //   },
        //   el: "date-picker",
        //   bindkey: "surStatus"
        // }
      ],
      dialogFormVisible: false,
      form: {
        systemId:'',
        systemName:'',
        systemKey:''
      }, //新增修改页面的对象
      formLabelWidth: "120px",
      radio: "1",
      obj: {},
      dialogVisible:false,
      filterVisible: true,
      ids:'',
      count:0,
      rules: {
				  systemName: [
					{ required: true, message: '请输入系统名称', trigger: 'blur' }
				  ],
				  systemKey: [
					{ required: true, message: '请输入系统key', trigger: 'blur' }
				  ],
			}
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {
    query() {
      return this.doQuery.bind(this, querySysData);
    }
  },
  created() {
    this.query();
  },
  methods: {
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
          selectArr.push(v.systemId);
        });
        this.deleted(selectArr.join(","));
      }
    },
    revise() {
      //批量修改
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
      this.count = ids.split(",");
      this.dialogVisible = true;
      this.ids = ids;
    },
    sure(){//确认删除
        deleteSysData({ systemId: this.ids }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.dialogVisible = false;
            this.query();
        });
    },
    editor(rows, isEditor) {
      this.dialogFormVisible = true;
      this.isEditor = isEditor;
      this.$nextTick(() => {
        isEditor ? this.form = _.pick(rows, _.keys(this.form)) : rows;
      });
    },
    handleSave() {//弹框保存
      this.$refs['editForm'].validate((valid) => {
          if (valid) {
            const requestApi = this.isEditor ? editorSysData : addSysData;//判断是修改还是新增，isEditor为true是修改
            requestApi(this.form).then(res => {
              this.$message({
                message: "操作成功！",
                type: "success"
              });
              this.handleFormDlogClose('editForm', 'dialogFormVisible');
              this.query();
            })
          } else {
            return false;
          }
      });
    },
  }
};
</script>
