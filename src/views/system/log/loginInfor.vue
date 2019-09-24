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
          <el-button type="tool" icon="el-icon-close" @click="batchDelete">删除</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="clearLog">清空</el-button>
          <el-button type="tool" icon="el-icon-export" @click="handleExport(baseExpApi)">导出</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" ref="multipleTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="slrInfoId" label="访问编码"></el-table-column>
            <el-table-column prop="slrLoginName" label="登录名称"></el-table-column>
            <el-table-column prop="slrIpaddr" label="登录地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="slrLoginLocation" label="登录地点" show-overflow-tooltip></el-table-column>
            <el-table-column prop="slrBrowser" label="浏览器" show-overflow-tooltip></el-table-column>
            <el-table-column prop="slrOs" label="操作系统" show-overflow-tooltip></el-table-column>
            <el-table-column prop="slrStatus" label="登录状态" show-overflow-tooltip>
              <template slot-scope="scope">
               <span
                  :style="{color:scope.row.slrStatus == '0' ? '#45eba7' : '#cb3203'}"
                >{{scope.row.slrStatus == '0' ? '成功' : '失败'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="slrOs" label="操作信息" show-overflow-tooltip></el-table-column>
            <el-table-column prop="slrLoginTime" label="登录时间" show-overflow-tooltip></el-table-column>
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
     <!-- 删除弹框 -->
    <el-dialog :visible.sync="dialogVisible">
        <div slot="title" class="dailog-title">
            <img src="../../../assets/images/icon-title-left.png" alt />
            <span class="title">系统提示信息</span>
            <img src="../../../assets/images/icon-title-right.png" alt />
        </div>
        <div style="width:100%;color:#63ACDF;text-align:center;">{{content}}</div>
        <div slot="footer" style="text-align: center;">
            <el-button type="primary" @click="sure">确 定</el-button>
            <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryLoginPage, clearLoginPage, deleteLoginPage } from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      baseExpApi:'/v1/logininfor/exportExcel',
      fqForm: [
        {
          fiAttr: {
            label: "登录地址"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "slrInfoId"
        },
        {
          fiAttr: {
            label: "登录名称"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "slrLoginName"
        },
        {
          fiAttr: {
            label: "登录状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "slrStatus",
          option: [
            { label: "所有", value: "" },
            { label: "成功", value: 0 },
            { label: "失败", value: 1 }
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
      form: {},
      obj: {},
      formLabelWidth: "120px",
      dialogVisible:false,
      ids:'',
      content:'',
      isClear:true,
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
        return this.doQuery.bind(this, queryLoginPage);
    }
  },
  methods: {
    batchDelete() {//批量删除
        let selectArr = [];
        if (this.$refs.multipleTable.selection.length == 0) {
            this.$message({
                message: "请选择需要删除的数据！",
                type: "warning"
            });
        } else {
            this.$refs.multipleTable.selection.forEach((v, i) => {
                selectArr.push(v.slrInfoId);
            });
            this.deleted(selectArr.join(","));
        }
    },
    deleted(ids) { //删除
        this.dialogVisible = true;
        this.isClear = false;
        this.content = '确定要删除数据吗？';
        this.ids = ids;
    },
    clearLog() { //清空日志
        this.dialogVisible = true;
        this.isClear = true;
        this.content = '确定要清空所有数据？';
    },
    sure(){//确认
        if(this.isClear){//清空接口
            clearLoginPage({}).then(res => {
                this.$message({
                type: "success",
                message: "清除成功!"
                });
                this.dialogVisible = false;
                this.query();
            });
        }else{//删除接口
            deleteLoginPage({ ids: this.ids }).then(res => {
                this.$message({
                type: "success",
                message: "删除成功!"
                });
                this.dialogVisible = false;
                this.query();
            });
        } 
    },
  }
};
</script>
