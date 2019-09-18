<template>
    <div class="logininfor-container">
        <div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="登录地址">
						<el-input v-model="sizeForm.address"></el-input>
					</el-form-item>
					<el-form-item label="登录名称">
						<el-input v-model="sizeForm.name"></el-input>
					</el-form-item>
					<el-form-item label="登录状态">
						<el-select v-model="sizeForm.status" placeholder="所有">
                            <el-option label="所有" value=""></el-option>
                            <el-option label="成功" value="0"></el-option>
                            <el-option label="失败" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-col :span="11">
						<el-date-picker type="beginTime" placeholder="开始时间" v-model="sizeForm.beginTime" style="width: 100%;"></el-date-picker>
						</el-col>
						<el-col class="line" :span="2">-</el-col>
						<el-col :span="11">
						<el-date-picker type="endTime" placeholder="结束时间" v-model="sizeForm.endTime" style="width: 100%;"></el-date-picker>
						</el-col>
					</el-form-item>
					<el-form-item size="large" class="query">
						<el-button type="primary" @click="queryDate()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="dashboard-content">
			 <!-- <div class="organization"></div> -->
			 <div class="table">
                <!-- <div class="main-right"> -->
                    <div class="tableHead">
                       <!-- <el-button><i class="iconComm add"></i>新增</el-button> -->
                        <el-button @click="batchDelete()"><i class="iconComm delete"></i>删除</el-button>
                        <el-button @click="clearLog()"><i class="iconComm modify"></i>清空</el-button>
                        <!-- <el-button><i class="iconComm loading"></i>导入</el-button> -->
                        <el-button @click="exported()"><i class="iconComm leading"></i>导出</el-button>
                        <div class="operation">
                            <div><span></span></div>
                            <div><span></span></div>
                            <div><span></span></div>
                            <div><span></span></div>
                        </div>
                    </div>
                    <div class="tabled">
                        <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column prop="slrInfoId" label="访问编码"></el-table-column>
                            <el-table-column prop="slrLoginName" label="登录名称"></el-table-column>
                            <el-table-column prop="slrIpaddr" label="登录地址" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="slrLoginLocation" label="登录地点" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="slrBrowser" label="浏览器" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="slrOs" label="操作系统" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="slrStatus" label="登录状态" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span :class="[scope.row.state  ? 'normal' : 'stop']">{{scope.row.state  ? '成功' : '失败'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mainHost" label="操作信息" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="mainHost" label="登录时间" show-overflow-tooltip></el-table-column>
                        </el-table>
                    </div>
                    <el-pagination style="text-align:right;margin-top:2%;"
                        background
                        v-show="pageShow"
                        @current-change="handleCurrentChange"
                        :current-page="current"
                        :page-size="pageSize"       
                        layout="prev, pager, next, jumper,total"
                        :total="total">
                    </el-pagination>
                <!-- </div> -->
			 </div>
		</div>
    </div>
</template>
<script>
import { queryLoginPage,clearLoginPage,deleteLoginPage } from '@/api';
export default {
    data() {
        return {
            sizeForm: {
                address: '',
                name:'',
                status: '',
                beginTime: '',
                endTime: '',
            },
            tableData: [],
            current: 1,//当前页
            total: 0,//总页
            pageSize:5,//每页条数  
            pageShow:false,//没有数据时隐藏分页
            dialogFormVisible: false,
            form:{},
            obj:{},
            formLabelWidth: '120px',
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
        handleCurrentChange: function(current) {//当前页
            this.current = current;
            this.query();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        queryDate(){
            queryLoginPage({
                slrLoginName:this.sizeForm.name,
                slrStatus:this.sizeForm.status,
                slrInfoId:this.sizeForm.address,
                pageNum:this.current,
                pageSize:this.pageSize,
                slrLoginTime:this.beginTime
            }).then(res => {
                console.log(res);
                this.tableData = res.rows;
                this.tableData.forEach((v,i) =>{
                    v.state = v.slrStatus == 0 ? true : false;
                });
                this.total = res.total*1;
                if(this.total > 0) {
                    this.pageShow = true;
                }
            });
        },
        batchDelete(){//批量删除
            let selectArr = [];
            if(typeof(this.multipleSelection) == "undefined"){
                this.$message({
                    message: '请选择需要删除的数据！',
                    type: 'warning'
                });
            }else{
                this.multipleSelection.forEach((v,i) => {
                    selectArr.push(v.dictId);
                })
                this.deleted(selectArr.join(','));
            }
        },
        deleted(ids){//删除
            this.$confirm('确认删除该数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteLoginPage({str:ids}).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.query();
                });  
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        clearLog(){//清空日志
            this.$confirm('确认清除数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                clearLoginPage({}).then(res => {
                    this.$message({
                        type: 'success',
                        message: '清除成功!'
                    });
                    this.query();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清除'
                });          
            });
        },
        exported(){//导出
            window.location.href = 'http://192.168.0.105:9091/uumsApi/v1/logininfor/exportExcel';
        },
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
                margin-left:0;
                .iconComm{
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    margin-right: 6px;
                    background:url(../../../assets/icon.png);
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
    .normal{
        color: #45EBA7 !important;
    }
    .stop{
        color:#CB3203 !important;
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
// .logininfor-container /deep/.el-checkbox__input.is-disabled .el-checkbox__inner{
//     background: transparent;
//     border: 1px solid #0284a1;
// }
.logininfor-container /deep/ .el-pagination .el-input__inner{
    background: none !important;
    border: none !important;
}
</style>
