<template>
  <div class="operlog-container">
    <div class="tabs-search">
      <!-- <div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="系统模块">
						<el-input v-model="sizeForm.module"></el-input>
					</el-form-item>
					<el-form-item label="操作人员">
						<el-input v-model="sizeForm.name"></el-input>
					</el-form-item>
					<el-form-item label="操作类型">
						<el-select v-model="sizeForm.type" placeholder="请选择">
                            <el-option label="新增" value="0"></el-option>
                            <el-option label="修改" value="1"></el-option>
                            <el-option label="删除" value="2"></el-option>
                            <el-option label="授权" value="3"></el-option>
                            <el-option label="导出" value="4"></el-option>
                            <el-option label="导入" value="5"></el-option>
                            <el-option label="强退" value="6"></el-option>
                            <el-option label="生成代码" value="7"></el-option>
                            <el-option label="清空数据" value="8"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="操作状态">
						<el-select v-model="sizeForm.status" placeholder="所有">
						    <el-option label="所有" value=""></el-option>
                            <el-option label="成功" value="0"></el-option>
                            <el-option label="失败" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="操作时间">
						<el-col :span="11">
						<el-date-picker type="beginTime" placeholder="开始时间" v-model="sizeForm.beginTime" style="width: 100%;"></el-date-picker>
						</el-col>
						<el-col class="line" :span="2">-</el-col>
						<el-col :span="11">
						<el-date-picker type="endTime" placeholder="结束时间" v-model="sizeForm.endTime" style="width: 100%;"></el-date-picker>
						</el-col>
					</el-form-item>
					<el-form-item size="large" class="query">
						<el-button type="primary" @click="query()">查询</el-button>
					</el-form-item>
				</el-form>
      </div>-->
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
            <el-table-column prop="operatorType" label="操作类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operName" label="操作人员" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operIp" label="主机" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operLocation" label="操作地点" show-overflow-tooltip></el-table-column>
            <el-table-column property="status" label="操作状态">
              <template slot-scope="scope">
               <span :class="[scope.row.status == '0'  ? 'normal' : 'stop']">{{scope.row.status == '0' ? '成功' : '失败'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="操作时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span @click="lookUp(scope.row)" style="color:#E6BF06;cursor: pointer;">详细</span>
              </template>
            </el-table-column>
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
    <el-dialog title="基本信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="height:308px;">
        <el-form-item label="操作模块" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录信息" :label-width="formLabelWidth">
          <el-input v-model="form.loginInfo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" :label-width="formLabelWidth">
          <el-input v-model="form.operLocation" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作方法" :label-width="formLabelWidth">
          <el-input v-model="form.operLocation" autocomplete="off"></el-input>
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
import { queryOperLPage, deleteOperLPage, clearOperLPage } from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      baseExpApi:'http://192.168.0.105:9091/uumsApi/v1/operLog/exportExcel',
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
          bindKey: "dictType"
        },
        {
          fiAttr: {
            label: "操作类型"
          },
          el: "select",
          elAttr: {},
          bindKey: "status",
          option: [
            {
              label: "新增",
              value: 0
            },
            {
              label: "修改",
              value: 1
            },
            {
              label: "删除",
              value: 2
            },
            {
              label: "授权",
              value: 3
            },
            {
              label: "导出",
              value: 4
            },
            {
              label: "导入",
              value: 5
            },
            {
              label: "强退",
              value: 6
            },
            {
              label: "生成代码",
              value: 7
            },
            {
              label: "清空数据",
              value: 8
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
      dialogFormVisible:false
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
          selectArr.push(v.dictId);
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
          deleteOperLPage({ str: ids }).then(res => {
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
    // exported() {
    //   //导出
    //   window.location.href =
    //     "http://192.168.0.105:9091/uumsApi/v1/operLog/exportExcel";
    // },
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
    lookUp() {
      //详情
    }
  }
};
</script>
