<template>
<<<<<<< HEAD
  <div class="appmain-container">
    <div class="main-left">
        <div class="zzBox">
            <span>组织结构</span>
            <div class="revise">
                <i class="comm revised"></i>
                <i class="comm refresh"></i>
                <i class="comm select"></i>
            </div>
        </div>
        <div></div>
    </div>
    <div class="main-right">
        <div class="tableHead">
            <el-button><i class="iconComm add"></i>新增</el-button>
            <el-button><i class="iconComm delete"></i>删除</el-button>
            <el-button><i class="iconComm modify"></i>修改</el-button>
            <el-button><i class="iconComm loading"></i>导入</el-button>
            <el-button><i class="iconComm leading"></i>导出</el-button>
        </div>
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                label="日期"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名"
                width="120">
                </el-table-column>
                <el-table-column
                prop="address"
                label="地址"
                show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination style="text-align:right;margin-top:2%;"
            background
            layout="prev, pager, next"
            :total="1000">
        </el-pagination>
    </div>
  </div>
=======
  <section class="app-main" id="app-main">
    <transition name="fade" mode="out-in">
      <!-- <keep-alive :include="cachedViews"> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </section>
>>>>>>> 044e5507260aaca9713fb4ba0ae9c004b94cd8ee
</template>
<script>
export default {
	name: 'head',
	data() {
		return {
			tableData3: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: []
		};
	},
    mounted() {
      
    },
	methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
	},
    
};
</script>
<style lang="scss" scoped>
<<<<<<< HEAD
    .appmain-container {
        width: 100%;
        height: calc(100% - 187px);
        background-size: 100% 100%;
        border:1px solid #02439D;
        margin-top: 187px;
        .main-left{
            width: 20%;
            height:100%;
            float: left;
            background:url(../../../assets/mainTree.png)no-repeat;
            background-size: 100% 100%;
            .zzBox{
                width: 85%;
                margin: auto;
                padding: 10px;
                span{
                    color:#fff;
                    font-size: 14px;
                }
                .revise{
                    width: 35%;
                    display: inline-block;
                    float: right;
                    .comm{
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        background:url(../../../assets/revise.png);
                        background-size: 100% 100%;
                        vertical-align: middle;
                        margin-right: 10%;
                        cursor: pointer;
                    }
                    .revised{
                        background:url(../../../assets/refresh.png);
                    }
                    .select{
                        background:url(../../../assets/select.png);
                    }
                }
            }
        }
        .main-right{
            width: 78.5%;
            height: 100%;
            float: right;
            background:url(../../../assets/mainTreeR.png)no-repeat;
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
                    background-size: 100% 100%;
                    vertical-align: middle;
                }
                .add{
                    background:url(../../../assets/add.png)no-repeat;
                }
                .delete{
                    background:url(../../../assets/delete.png)no-repeat;
                }
                .modify{
                    background:url(../../../assets/modify.png)no-repeat;
                }
                .loading{
                    background:url(../../../assets/loading.png)no-repeat; 
                }
                .leading{
                    background:url(../../../assets/leading.png)no-repeat; 
                }
            }
            .table{
                margin: 10px 0;
                
            }
        }
=======
    .app-main {
        width: calc(100% - 284px);
        height: 100%;
        margin-left: 15px;
>>>>>>> 044e5507260aaca9713fb4ba0ae9c004b94cd8ee
    }
    .appmain-container /deep/ .el-table tr{
        height: 45px !important;
    }
    .appmain-container /deep/ .el-pagination .btn-prev, .el-pagination .btn-next{
        background: transparent;
        color: #8489A8;
    }
    .appmain-container /deep/ .btn-prev .el-icon-arrow-left{
        display: inline-block;
        width: 10px;
        height: 14px;
        vertical-align: middle;       
        background:url(../../../assets/left.png)no-repeat; 
    }
</style>
