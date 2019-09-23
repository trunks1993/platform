<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="false"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterFilter="handleFilter($event, query)"
    ></FilterQueryForm>
    <div class="app-wrapper" style="display: flex;">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="addInfo">新增</el-button>
          <el-button type="tool" icon="el-icon-close" @click="batchDelete">删除</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
          <el-button type="tool" icon="el-icon-export" @click="handleExport(baseExpApi)">导出</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" @selection-change="handleSelectionChange">
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
                <el-button type="text" @click="editor(scope.row)">编辑</el-button>
                <el-button type="text-danger" @click="deleted(scope.row.dictId)">删除</el-button>
                <el-button type="text-warn" >列表</el-button>
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
    <!-- 弹框 -->
    <el-dialog :visible.sync="dialogFormVisible">
        <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">字典管理基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" :inline="true">
        <el-form-item label="字典名称" :label-width="formLabelWidth">
          <el-input v-model="form.dictName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" :label-width="formLabelWidth">
          <el-input v-model="form.dictType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="form.state"></el-switch>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" class="inputTextarea">
          <el-input v-model="form.remark" autocomplete="off" type="textarea" class="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="save()">保 存</el-button>
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
        <div style="width:100%;color:#63ACDF;text-align:center;">确定要删除数据吗？</div>
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
    //   value: true,
      form: {},
      dialogFormVisible: false,
      obj: {},
      formLabelWidth: "120px",
      dialogVisible:false,
      ids:'',
      multipleSelection: [], // 选中的数据二维数组
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    change(data) {
      console.log(data);
    },
    batchDelete() {
      //批量删除
      let selectArr = [];
      if (typeof this.multipleSelection == "undefined") {
        this.$message({
          message: "请选择需要删除的数据！",
          type: "warning"
        });
      } else {
        this.multipleSelection.forEach((v, i) => {
          selectArr.push(v.dictId);
        });
        this.deleted(selectArr.join(","));
      }
    },
    deleted(ids) {
      //删除
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
      if (typeof this.multipleSelection == "undefined") {
        this.$message({
          message: "请选择需要修改的数据！",
          type: "warning"
        });
      } else {
        if(this.multipleSelection.length > 1){
            this.$message({
                message: "只能选择一条数据进行修改",
                type: "warning"
            });
            return;
        }
        this.dialogFormVisible = true;
        this.form = this.multipleSelection.pop(); //获取最后一条
        this.obj = this.multipleSelection.pop();
      }
    },
    addInfo() {
      //新增
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    editor(rows) {
      //编辑
      this.dialogFormVisible = true;
      this.form = rows;
      this.obj = rows;
      let status = this.form.status == "0" ? true : false;
      this.$set(this.form, "state", status); //强制更新form中state的值
    },
    save() {
      //编辑入参
      if (JSON.stringify(this.obj) == "{}") {
        //新增
        this.addAsk();
      } else {
        //编辑
        this.saveAsk();
      }
    },
    saveAsk() {
      //编辑保存
      this.form.status = this.form.state ? "0" : "1"; //更新状态传给后端
      editorDictPage(this.form).then(res => {
        this.$message({
          message: "修改成功！",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.query();
      });
    },
    addAsk() {
      //新增保存
      this.form.status = this.form.state ? "0" : "1";
      addDictPage(this.form).then(res => {
        this.$message({
          message: "新增成功！",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.query();
      });
    },
    handDictDate(rows){
        console.log(rows);
        // this.$router.push('dictDate');
    }
  }
};
</script>