<template>
    <div class="logininfor-container">
        <div class="tabs-search">
			<!-- <Search></Search> -->
		</div>
		<div class="dashboard-content">
			 <!-- <div class="organization"></div> -->
			 <div class="table">
                <!-- <div class="main-right"> -->
                    <div class="tableHead">
                       <!-- <el-button><i class="iconComm add"></i>新增</el-button> -->
                        <el-button><i class="iconComm delete"></i>删除</el-button>
                        <el-button><i class="iconComm modify"></i>清空</el-button>
                        <!-- <el-button><i class="iconComm loading"></i>导入</el-button> -->
                        <el-button><i class="iconComm leading"></i>导出</el-button>
                        <div class="operation">
                            <div><span></span></div>
                            <div><span></span></div>
                            <div><span></span></div>
                            <div><span></span></div>
                        </div>
                    </div>
                    <div class="tabled">
                        <el-table border
                            ref="multipleTable"
                            :data="tableData3"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                            type="selection">
                            </el-table-column>
                            <el-table-column
                            label="访问编码">
                            <template slot-scope="scope">{{ scope.row.logNumber }}</template>
                            </el-table-column>
                            <el-table-column
                            prop="sysModule"
                            label="登录名称">
                            </el-table-column>
                            <el-table-column
                            prop="operateType"
                            label="登录地址"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="operator"
                            label="登录地点"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="department"
                            label="浏览器"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="mainHost"
                            label="操作系统"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="mainHost"
                            label="登录状态"
                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <el-switch
                                    v-model="scope.row.status">
                                    </el-switch> -->
                                    <span style="color:#45EBA7;">成功</span>
                                    <!-- <span style="color:#CB3203;">失败</span> -->
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="mainHost"
                            label="操作信息"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="mainHost"
                            label="登录时间"
                            show-overflow-tooltip>
                            </el-table-column>
                            <!-- <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span class="editor">编辑</span>
                                    <span class="editor">删除</span>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </div>
                    <el-pagination style="text-align:right;margin-top:2%;"
                        background
                        layout="prev, pager, next"
                        :total="1000">
                    </el-pagination>
                <!-- </div> -->
			 </div>
		</div>
    </div>
</template>
<script>
import { queryGwPage } from '@/api';
export default {
  data() {
    return {
         tableData3: [{
            logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:'操作状态',
            time:'操作时间',
            // operate:'操作'

        }, {
           logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:'操作状态',
            time:'操作时间',
            // operate:'操作'
        }, {
            logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:'操作状态',
            time:'操作时间',
            // operate:'操作'
        }, {
            logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:'操作状态',
            time:'操作时间',
            // operate:'操作'
        }, {
            logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:'操作状态',
            time:'操作时间',
            // operate:'操作'
        }, {
           logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:'操作状态',
            time:'操作时间',
            // operate:'操作'
        }, {
            logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:'操作状态',
            time:'操作时间',
            // operate:'操作'
        }],
    };
  },
  components: {
	//   Search
  },
  computed: {

  },
  created() {
      this.queryDate();
  },
  methods: {
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    queryDate() {
        // console.log(getToken());
        let params = {
            postCode:'',
            postName:'',
            status:''
        };
        queryGwPage(params).then((res) =>{
            debugger;
            console.log(res);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.logininfor-container {
    color: #fff;
    height: 100%;
    .tabs-search {
        height: 187px;
    }
    .dashboard-content {
        height: calc(100% - 187px);
        display: flex;
        .table {
            width: 100%;
            height: 100%;
            background:url(../../assets/mainTreeR.png)no-repeat;
            background-size: 100% 100%;
            padding: 1.5%;
            .el-button{
                width: 90px;
                height: 36px;
                background:#05254B;
                border-radius:4px;
                outline: none;
                border: none;
                font-size: 14px;
                color:#fff;
                margin-right: 10px;
                margin-left:0;
                .iconComm{
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    margin-right: 6px;
                    background:url(../../assets/icon.png);
                }
                .add{
                    background-position: -57px 792px;
                }
                .delete{
                    background-position: -57px 770px;
                }
                .modify{
                    background-position: -57px 749px;
                }
                .loading{
                    background-position: -57px 726px;
                }
                .leading{
                    background-position: -57px 704px;
                }
            }
            .operation {
                width: 210px;
                height: 36px;
                background: #05254B;
                border:1px solid #02439D;
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
                        background-image: url(../../assets/icon.png);
                        background-position: -57px 422px;
                        position: absolute;
                        left: 50%;
                        margin-left: -7px;
                        top: 50%;
                        margin-top: -7px;
                    }
                }
                div::before {
                    content: '';
                    width: 1px;
                    height: 28px;
                    display: inline-block;
                    background:linear-gradient(0deg,rgba(1,84,199,0) 0%,rgba(1,84,199,1) 42%,rgba(1,84,199,0) 100%);
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
            .tabled{
                margin: 10px 0;
            }
            
        }
    }
}
.logininfor-container /deep/.cell span.editor {
    padding: 10px;
    cursor: pointer;
}
.logininfor-container /deep/.cell span:nth-child(1) {
    color: #45EBA7;
}
.logininfor-container /deep/.cell span:nth-child(2) {
    color: #CB3203;
}
.logininfor-container /deep/.cell span:nth-child(3) {
    color: #E6BF06;
}
</style>
