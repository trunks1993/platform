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
          <el-table :data="tableDataList" ref="multipleTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="postId" label="岗位编号"></el-table-column>
            <el-table-column prop="postCode" label="岗位编码"></el-table-column>
            <el-table-column prop="postName" label="岗位名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="postSort" label="显示顺序" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                 <span
                  :style="{color:scope.row.status == '0' ? '#45eba7' : '#cb3203'}"
                >{{scope.row.status == '0' ? '正常' : '停用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editor(scope.row)">编辑</el-button>
                <el-button type="text-danger" @click="deleted(scope.row.postId)">删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" @close="close">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">岗位管理基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form">
        <el-form-item label="岗位名称" :label-width="formLabelWidth">
          <el-input v-model="form.postName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" :label-width="formLabelWidth">
          <el-input v-model="form.postCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" :label-width="formLabelWidth">
          <el-input v-model="form.postSort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗位状态" :label-width="formLabelWidth" style="width: 325px;">
          <el-switch v-model="form.state"></el-switch>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" class="inputTextarea">
          <el-input v-model="form.remark" autocomplete="off" type="textarea" class="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button type="primary" @click="close">关 闭</el-button>
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
  queryGwPage,
  deleteGwPage,
  exportGwPage,
  editorGwPage,
  addGwPage
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      baseExpApi: "/v1/manage/post/export",
      fqForm: [
        {
          fiAttr: {
            label: "岗位编码"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "postCode"
        },
        {
          fiAttr: {
            label: "岗位名称"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "postName"
        },
        {
          fiAttr: {
            label: "岗位状态"
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
      dialogFormVisible: false,
      form: {}, //新增修改页面的对象
      formLabelWidth: "120px",
      radio: "1",
      obj: {},
      dialogVisible:false,
      ids:'',
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {
    query() {
      return this.doQuery.bind(this, queryGwPage);
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
          selectArr.push(v.postId);
        });
        this.deleted(selectArr.join(","));
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
      let status = this.obj.status == "0" ? true : false;
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
      editorGwPage(this.form).then(res => {
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
      addGwPage(this.form).then(res => {
        this.$message({
          message: "新增成功！",
          type: "success"
        });
        this.dialogFormVisible = false;
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
        this.form = this.$refs.multipleTable.selection[0]; //获取最后一条
        this.obj = this.$refs.multipleTable.selection[0];
        let status = this.form.status == "0" ? true : false;
        this.$set(this.form, "state", status); //强制更新form中state的值
      }
    },
    deleted(ids) {
      //删除
      this.dialogVisible = true;
      this.ids = ids;
    },
    sure(){//确认删除
        deleteGwPage({ str: this.ids }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.dialogVisible = false;
            this.query();
        });
    },
    close(){//关闭事件
      this.dialogFormVisible = false;
      this.query();
    }
  }
};
</script>
