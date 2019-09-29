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
          <el-button type="tool" icon="el-icon-export" @click="handleExport(baseExpApi,'字典管理')">导出</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" ref="multipleTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="dictId" label="字典主键"></el-table-column>
            <el-table-column prop="dictName" label="字典名称"></el-table-column>
            <el-table-column prop label="字典类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="type" style="color:#4baefd;cursor: pointer;" @click="handDictDate(scope.row)">{{ scope.row.dictType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.status == '0' ? '#45eba7' : '#cb3203'}"
                >{{scope.row.status == '0' ? '正常' : '停用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row, true)">编辑</el-button>
                <el-button type="text-danger" @click="deleted(scope.row.dictId)">删除</el-button>
                <el-button type="text-warn" @click="handDictDate(scope.row)">列表</el-button>
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
    <!-- 弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" :before-close="handleFormDlogClose.bind(null, 'editForm')">
        <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">字典管理基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" ref="editForm" :inline="true" :rules="rules">
        <el-form-item label="字典编号" prop="dictId" :label-width="formLabelWidth" style="display:none">
          <el-input v-model="form.dictId" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName" :label-width="formLabelWidth">
          <el-input v-model="form.dictName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType" :label-width="formLabelWidth">
          <el-input v-model="form.dictType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
           <el-switch v-model="form.status" active-value="0" inactive-value="1" ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :label-width="formLabelWidth" class="inputTextarea">
          <el-input v-model="form.remark" autocomplete="off" type="textarea" class="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="handleSave">保 存</el-button>
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
  queryDictPage,
  deleteDictPage,
  editorDictPage,
  addDictPage
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
import _ from 'lodash';
export default {
  mixins: [mixin],
  data() {
    return {
      baseExpApi:
        "/v1/dictionaries/dictType/export",
      fqForm: [
        {
          fiAttr: {
            label: "字典名称"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "dictName"
        },
        {
          fiAttr: {
            label: "字典类型"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "dictType"
        },
        {
          fiAttr: {
            label: "字典状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "status",
          bindValue: "",
          option: {
            url:
              "/v1/dictionaries/dictData/selectByDictType?dictType=sys_dict_status",
            labelKey: "dictLabel",
            valueKey: "dictValue"
          }
        }
        // {
        //   fiAttr: {
        //     label: "创建时间"
        //   },
        //   el: "date-picker",
        //   bindkey: "surStatus"
        // }
      ],
    //   value: true,
      form: {
        dictId:'',
        dictName:'',
        dictType:'',
        status:'0',
        remark:''
      },
      dialogFormVisible: false,
      filterVisible: true,
      obj: {},
      formLabelWidth: "120px",
      dialogVisible:false,
      ids:'',
      count:0,
      rules: {
				  dictName: [
					{ required: true, message: '请输入字典名称', trigger: 'blur' }
				  ],
				  dictType: [
					{ required: true, message: '请输入字典类型', trigger: 'blur' }
          ]
			}
    };
  },
  components: {
    FilterQueryForm
  },
  created() {
    this.query();
  },
  computed: {
    query() {
      return this.doQuery.bind(this, queryDictPage);
    }
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
          selectArr.push(v.dictId);
        });
        this.deleted(selectArr.join(","));
      }
    },
    deleted(ids) {
      //删除
      this.count = ids.split(",");
      this.dialogVisible = true;
      this.ids = ids;
    },
    sure(){//确认删除
        deleteDictPage({ str: this.ids }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.dialogVisible = false;
            this.query();
          });
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
            const requestApi = this.isEditor ? editorDictPage : addDictPage;//判断是修改还是新增，isEditor为true是修改
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
    handDictDate(rows){
      this.$router.push('/system/dictData?type='+rows.dictType+'&id='+rows.dictId);
    }
  }
};
</script>