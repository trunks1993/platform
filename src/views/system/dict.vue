<template>
    <div class="dict-container">
        <div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="登录名称">
						<el-input v-model="sizeForm.surLoginName"></el-input>
					</el-form-item>
					<el-form-item label="手机号码">
						<el-input v-model="sizeForm.surPhoneNumber"></el-input>
					</el-form-item>
					<el-form-item label="用户状态">
						<el-select v-model="sizeForm.surStatus" placeholder="全部">
						<el-option label="正常" value="0"></el-option>
						<el-option label="停用" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-col :span="11">
						<el-date-picker type="surBeginTime" placeholder="开始时间" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>
						</el-col>
						<el-col class="line" :span="2">-</el-col>
						<el-col :span="11">
						<el-date-picker type="surEndTime" placeholder="结束时间" v-model="sizeForm.date2" style="width: 100%;"></el-date-picker>
						</el-col>
					</el-form-item>
					<el-form-item size="large" class="query">
						<el-button type="primary" >查询</el-button>
					</el-form-item>
				</el-form>
			</div>
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
                        <el-table border ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column label="字典主键">
                                <template slot-scope="scope">{{ scope.row.logNumber }}</template>
                            </el-table-column>
                            <el-table-column prop="sysModule" label="字典名称"></el-table-column>
                            <el-table-column prop="operateType" label="字典类型" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="operator" label="状态" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="department" label="备注" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="mainHost" label="创建时间" show-overflow-tooltip></el-table-column>
                            <el-table-column property="status" label="操作状态">
                                <template slot-scope="scope">
                                    <!-- <el-switch
                                    v-model="scope.row.status">
                                    </el-switch> -->
                                    <span style="color:#45EBA7;">成功</span>
                                    <!-- <span style="color:#CB3203;">失败</span> -->
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="time"
                            label="操作时间"
                            show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span class="editor">编辑</span>
									<span class="editor">删除</span>
                                    <span class="editor">列表</span>
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
         value: true,
         sizeForm: {
			surLoginName: '',
			surPhoneNumber:'',
			surStatus: '',
			surBeginTime: '',
			surEndTime: '',
		},
         tableData3: [{
            logNumber: '2016-05-03',
            sysModule: '王小虎',
            operateType: '上海市普陀区金沙江路 1518 弄',
            operator:'操作人员',
            department:'XX部门',
            mainHost:'主机',
            operateAddress:'操作地点',
            status:true,
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
            status:true,
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
            status:true,
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
            status:true,
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
            status:true,
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
            status:true,
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
            status:true,
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
    },
    change (data) {
      console.log(data)
    }
  }
};
</script>
<style lang="scss" scoped>
.dict-container {
    color: #fff;
    height: 100%;
    .tabs-search {
        height: 187px;
        .query{
            margin: 0 !important;
            width: 0 !important;
        }
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
.dict-container /deep/ .el-switch {
    display: inline-flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 24px;
    height: 24px;
    vertical-align: middle;
}
.dict-container /deep/.el-switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
}
.dict-container /deep/.el-switch.is-checked .el-switch__core {
    border-color: #4BAEFD;
    background-color: #4BAEFD;
}
.dict-container /deep/.el-switch.is-disabled .el-switch__core, .el-switch.is-disabled .el-switch__label {
    cursor: not-allowed;
}
.dict-container /deep/.el-switch__core {
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
    transition: border-color .3s,background-color .3s;
    vertical-align: middle;
}
.dict-container /deep/.el-switch.is-checked .el-switch__core:after {
    left: 88%;
    margin-left: -17px;
}
.dict-container /deep/.el-switch__core:after {
    content: "";
    position: absolute;
    top: 0px;
    left: 1px;
    border-radius: 100%;
    transition: all .3s;
    width: 23px;
    height: 23px;
    background-color: #fff;
}
.dict-container /deep/.cell span.editor {
    padding: 10px;
    cursor: pointer;
}
.dict-container /deep/.cell span:nth-child(1) {
    color: #45EBA7;
}
.dict-container /deep/.cell span:nth-child(2) {
    color: #CB3203;
}
.dict-container /deep/.cell span:nth-child(3) {
    color: #E6BF06;
}
</style>
