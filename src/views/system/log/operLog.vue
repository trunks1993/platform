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
          <el-table :data="tableDataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="operId" label="日志编号"></el-table-column>
            <el-table-column prop="title" label="系统模块"></el-table-column>
            <el-table-column prop="operatorType" label="操作类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="(item,index) in options" :key="index">{{item.value == scope.row.operatorType ? item.label : ''}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="operName" label="操作人员" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operIp" label="主机" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operUrl" label="操作地点" show-overflow-tooltip></el-table-column>
            <el-table-column property="status" label="操作状态">
              <template slot-scope="scope">
                 <span
                  :style="{color:scope.row.status == '0' ? '#45eba7' : '#cb3203'}"
                >{{scope.row.status == '0' ? '成功' : '失败'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="operTime" label="操作时间" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <span @click="lookUp(scope.row)" style="color:#E6BF06;cursor: pointer;">详细</span>
              </template>
            </el-table-column>-->
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
            <img src="../../../assets/images/icon-title-left.png" alt />
            <span class="title">操作日志基本信息</span>
            <img src="../../../assets/images/icon-title-right.png" alt />
        </div>
      <el-form :model="form">
        <el-form-item label="操作模块" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录信息" :label-width="formLabelWidth">
          <el-input v-model="form.operName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" :label-width="formLabelWidth">
          <el-input v-model="form.operUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作方法" :label-width="formLabelWidth">
          <el-input v-model="form.methodName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" style="width: 325px;">
          <template slot-scope="scope">
            <span :class="[scope.row.state  ? 'normal' : 'stop']">{{scope.row.state ? '成功' : '失败'}}</span>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
     <!-- 删除弹框 -->
    <el-dialog :visible.sync="dialogVisible">
        <div slot="title" class="dailog-title">
            <img src="../../../assets/images/icon-title-left.png" alt />
            <span class="title">系统提示信息</span>
            <img src="../../../assets/images/icon-title-right.png" alt />
        </div>
        <div style="width:100%;color:#63ACDF;text-align:center;">{{content}}？</div>
        <div slot="footer" style="text-align: center;">
            <el-button type="primary" @click="sure">确 定</el-button>
            <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryOperLPage,
  deleteOperLPage,
  clearOperLPage,
  selectTypePage,
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      baseExpApi: "/v1/operLog/exportExcel",
      fqForm: [
        {
          fiAttr: {
            label: "系统模块"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "title"
        },
        {
          fiAttr: {
            label: "操作人员"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "operName"
        },
        {
          fiAttr: {
            label: "操作类型"
          },
          el: "select",
          elAttr: {},
          bindKey: "operatorType",
          option: [
            {
              label: "请选择",
              value: ""
            },
            {
              label: "其他",
              value: 0
            },
            {
              label: "新增",
              value: 1
            },
            {
              label: "修改",
              value: 2
            },
            {
              label: "删除",
              value: 3
            },
            {
              label: "授权",
              value: 4
            },
            {
              label: "导出",
              value: 5
            },
            {
              label: "导入",
              value: 6
            },
            {
              label: "强退",
              value: 7
            },
            {
              label: "生成代码",
              value: 8
            },
            {
              label: "清空",
              value: 9
            }
          ]
        },
        {
          fiAttr: {
            label: "操作状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "status",
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
      value: true,
      form: {},
      obj: {},
      formLabelWidth: "120px",
      dialogFormVisible: false,
      options: [],
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
    this.selectType();
  },
  computed: {
    query() {
      return this.doQuery.bind(this, queryOperLPage);
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
          selectArr.push(v.operId);
        });
        this.deleted(selectArr.join(","));
      }
    },
    deleted(ids) {
      //删除
        this.dialogVisible = true;
        this.isClear = false;
        this.content = '确定要删除数据吗？';
        this.ids = ids;
    },
    clearLog(){//清空
        this.dialogVisible = true;
        this.isClear = true;
        this.content = '确定要清空所有数据？';
    },
    sure(){//确认
        if(this.isClear){//清空接口
            clearOperLPage({}).then(res => {
                this.$message({
                type: "success",
                message: "清除成功!"
                });
                this.dialogVisible = false;
                this.query();
            });
        }else{//删除接口
            deleteOperLPage({ ids: this.ids }).then(res => {
                this.$message({
                type: "success",
                message: "删除成功!"
                });
                this.dialogVisible = false;
                this.query();
            });
        }  
    },
    selectType() { //操作类型
        selectTypePage({
            dictType: "log_oper_type"
        }).then(res => {
            res.forEach((item, index) => {
            var obj = {};
            obj.label = item.dictLabel;
            obj.value = item.dictValue;
            this.options.push(obj);
            });
        });
    },
    lookUp() {
      //详情
    }
  }
};
</script>
