<template>
  <div class="operlog-container">
    <div class="tabs-search">
      <FilterQueryForm
        :fAttr="{'label-width': '80px'}"
        :resetBtnVisible="false"
        :searchBtnVisible="true"
        :model="fqForm"
        @afterFilter="handleFilter($event, query)"
      ></FilterQueryForm>
    </div>
    <div class="dashboard-content">
      <!-- <div class="organization"></div> -->
      <div class="table">
        <!-- <div class="main-right"> -->
        <div class="tableHead">
          <!-- <el-button><i class="iconComm add"></i>新增</el-button> -->
          <el-button @click="batchDelete()">
            <i class="iconComm delete"></i>删除
          </el-button>
          <el-button @click="clearLog()">
            <i class="iconComm modify"></i>清空
          </el-button>
          <!-- <el-button><i class="iconComm loading"></i>导入</el-button> -->
          <el-button @click="handleExport(baseExpApi)">
            <i class="iconComm leading"></i>导出
          </el-button>
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
        <div class="tabled">
          <el-table
            border
            ref="multipleTable"
            :data="tableDataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
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
                  :class="[scope.row.status == '0'  ? 'normal' : 'stop']"
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
        <el-pagination
          style="text-align:right;margin-top:2%;"
          background
          layout="prev, pager, next"
          @size-change="handleSizeChange($event, query)"
          @current-change="handleCurrentChange($event, query)"
          :current-page="queryList.pageNum"
          :page-size="queryList.pageSize"
          :total="total"
        ></el-pagination>
        <!-- </div> -->
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog title="操作日志基本信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="height:308px;">
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
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="save()">保 存</el-button> -->
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
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
      baseExpApi: "http://192.168.0.105:9091/uumsApi/v1/operLog/exportExcel",
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
      options: []
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
      this.$confirm("确认删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOperLPage({ ids: ids }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.query();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    clearLog() {
      //清空日志
      this.$confirm("确认清除数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          clearOperLPage({}).then(res => {
            this.$message({
              type: "success",
              message: "清除成功!"
            });
            this.query();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清除"
          });
        });
    },
    selectType() {
      //操作类型
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
<style lang="scss" scoped>
.operlog-container {
  color: #fff;
  height: 100%;
  .tabs-search {
    height: 187px;
  }
  .dashboard-content {
    width: 100%;
    height: calc(100% - 187px);
    display: flex;
    .table {
      width: 100%;
      height: 100%;
      background: url(../../../assets/mainTreeR.png) no-repeat;
      background-size: 100% 100%;
      padding: 1.5%;
      .el-button {
        width: 90px;
        height: 36px;
        background: #05254b;
        border-radius: 4px;
        outline: none;
        border: none;
        font-size: 14px;
        color: #fff;
        margin-right: 10px;
        margin-left: 0;
        .iconComm {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 6px;
          background: url(../../../assets/icon.png);
        }
        .add {
          background-position: -57px 792px;
        }
        .delete {
          background-position: -57px 770px;
        }
        .modify {
          background-position: -57px 749px;
        }
        .loading {
          background-position: -57px 726px;
        }
        .leading {
          background-position: -57px 704px;
        }
      }
      .operation {
        width: 210px;
        height: 36px;
        background: #05254b;
        border: 1px solid #02439d;
        float: right;
        display: flex;
        div {
          width: 25%;
          height: 28px;
          margin-top: 4px;
          position: relative;
          cursor: pointer;
          span {
            width: 14px;
            height: 14px;
            display: inline-block;
            background-image: url(../../../assets/icon.png);
            background-position: -57px 422px;
            position: absolute;
            left: 50%;
            margin-left: -7px;
            top: 50%;
            margin-top: -7px;
          }
        }
        div::before {
          content: "";
          width: 1px;
          height: 28px;
          display: inline-block;
          background: linear-gradient(
            0deg,
            rgba(1, 84, 199, 0) 0%,
            rgba(1, 84, 199, 1) 42%,
            rgba(1, 84, 199, 0) 100%
          );
        }
        div:nth-child(1):before {
          width: 0;
        }
        div:nth-child(2) span {
          background-position: -57px 376px;
        }
        div:nth-child(3) span {
          background-position: -57px 331px;
        }
        div:nth-child(4) span {
          background-position: -57px 288px;
        }
      }
      .tabled {
        margin: 10px 0;
      }
    }
  }
  .normal {
    color: #45eba7 !important;
  }
  .stop {
    color: #cb3203 !important;
  }
}
.operlog-container /deep/ .el-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 24px;
  height: 24px;
  vertical-align: middle;
}
.operlog-container /deep/.el-switch__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}
.operlog-container /deep/.el-switch.is-checked .el-switch__core {
  border-color: #4baefd;
  background-color: #4baefd;
}
.operlog-container /deep/.el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: not-allowed;
}
.operlog-container /deep/.el-switch__core {
  margin: 0;
  display: inline-block;
  position: relative;
  width: 50px !important;
  height: 24px;
  border: 1px solid #dcdfe6;
  outline: none;
  border-radius: 25px;
  box-sizing: border-box;
  background: #dcdfe6;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
  vertical-align: middle;
}
.operlog-container /deep/.el-switch.is-checked .el-switch__core:after {
  left: 88%;
  margin-left: -17px;
}
.operlog-container /deep/.el-switch__core:after {
  content: "";
  position: absolute;
  top: 0px;
  left: 1px;
  border-radius: 100%;
  transition: all 0.3s;
  width: 23px;
  height: 23px;
  background-color: #fff;
}
// .operlog-container /deep/.el-checkbox__input.is-disabled .el-checkbox__inner{
//     background: transparent;
//     border: 1px solid #0284a1;
// }
.operlog-container /deep/ .el-pagination .el-input__inner {
  background: none !important;
  border: none !important;
}
.operlog-container
  /deep/
  .el-form-item:nth-child(4)
  .el-form-item__content
  div:nth-child(1) {
  width: 100%;
}
.operlog-container /deep/ .el-table th,
.el-table tr {
  border-top: 1px solid rgba(96, 118, 173, 0.3) !important;
}
.operlog-container /deep/ .el-table tr th:first-child {
  border-left: 1px solid rgba(96, 118, 173, 0.3) !important;
}
.operlog-container /deep/ .el-table tr td:first-child {
  border-left: 1px solid rgba(96, 118, 173, 0.3) !important;
}
</style>
