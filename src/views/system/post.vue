<template>
    <div class="post-container">
        <div class="tabs-search">
			<!-- <Search></Search> -->
		</div>
		<div class="dashboard-content">
			 <!-- <div class="organization"></div> -->
			 <div class="table">
                <!-- <div class="main-right"> -->
                    <div class="tableHead">
                        <el-button><i class="iconComm add"></i>新增</el-button>
                        <el-button><i class="iconComm delete"></i>删除</el-button>
                        <el-button><i class="iconComm modify"></i>修改</el-button>
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
                            label="岗位编号">
                            <template slot-scope="scope">{{ scope.row.logNumber }}</template>
                            </el-table-column>
                            <el-table-column
                            prop="sysModule"
                            label="岗位编码">
                            </el-table-column>
                            <el-table-column
                            prop="operateType"
                            label="岗位名称"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="operator"
                            label="显示顺序"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="department"
                            label="状态"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                            prop="mainHost"
                            label="创建时间"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span>编辑</span>
                                    <span>删除</span>
                                </template>
                            </el-table-column>
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
// import Search from '../layout/components/Search'
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
  methods: {
    handleSelectionChange(val) {
        this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.post-container {
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
// .post-container /deep/ .el-table tr th:not(:first-child){
//     border-left:1px solid #02439D;
// }
// .post-container /deep/ .el-table{
//     border:1px solid #02439D;
//     opacity:0.5;
// }
// .post-container /deep/ .el-table tr td:not(:first-child){
//     border-left:1px solid #02439D;
//     opacity:0.5;
// }
// .post-container /deep/ .el-table tr td{
//     border-top:1px solid #02439D;
//     opacity:0.5;
// }
</style>
