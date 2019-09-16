<template>
    <div class="post-container">
        <div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="岗位编码">
						<el-input v-model="sizeForm.code"></el-input>
					</el-form-item>
					<el-form-item label="岗位名称">
						<el-input v-model="sizeForm.name"></el-input>
					</el-form-item>
					<el-form-item label="岗位状态">
						<el-select v-model="sizeForm.region" placeholder="全部">
                            <el-option label="所有" value=""></el-option>
                            <el-option label="正常" value="0"></el-option>
                            <el-option label="停用" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item size="large">
						<el-button type="primary" @click="onSubmit">查询</el-button>
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
                        <el-table border
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                            type="selection">
                            </el-table-column>
                            <el-table-column prop="postId" label="岗位编号"> </el-table-column>
                            <el-table-column prop="postCode" label="岗位编码"></el-table-column>
                            <el-table-column prop="postName" label="岗位名称" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="postSort" label="显示顺序" show-overflow-tooltip></el-table-column>
                            <el-table-column label="状态" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <el-switch
                                    v-model="scope.row.status">
                                    </el-switch> -->
                                    <span :class="[scope.row.status == '正常' ? 'normal' : 'stop']">{{scope.row.status}}</span>
                                    <!-- <span style="color:#CB3203;">停用</span> -->
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span class="editor" @click="handleClick(scope.row)">编辑</span>
                                    <span class="editor" @click="deleted(scope.row)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-pagination style="text-align:right;margin-top:3.5%;"
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
import { queryGwPage,deleteGwPage } from '@/api/app';
import Search from "../layout/components/Search";
export default {
  data() {
    return {
        sizeForm: {
			code: '',
			name:'',
			region: '',
        },
        tableData:[],
        // tableData3: [{
        //     logNumber: '2016-05-03',
        //     sysModule: '王小虎',
        //     operateType: '上海市普陀区金沙江路 1518 弄',
        //     operator:'操作人员',
        //     department:'XX部门',
        //     mainHost:'主机',
        //     operateAddress:'操作地点',
        //     status:'操作状态',
        //     time:'操作时间',
        //     // operate:'操作'

        // }, {
        //    logNumber: '2016-05-03',
        //     sysModule: '王小虎',
        //     operateType: '上海市普陀区金沙江路 1518 弄',
        //     operator:'操作人员',
        //     department:'XX部门',
        //     mainHost:'主机',
        //     operateAddress:'操作地点',
        //     status:'操作状态',
        //     time:'操作时间',
        //     // operate:'操作'
        // }, {
        //     logNumber: '2016-05-03',
        //     sysModule: '王小虎',
        //     operateType: '上海市普陀区金沙江路 1518 弄',
        //     operator:'操作人员',
        //     department:'XX部门',
        //     mainHost:'主机',
        //     operateAddress:'操作地点',
        //     status:'操作状态',
        //     time:'操作时间',
        //     // operate:'操作'
        // }, {
        //     logNumber: '2016-05-03',
        //     sysModule: '王小虎',
        //     operateType: '上海市普陀区金沙江路 1518 弄',
        //     operator:'操作人员',
        //     department:'XX部门',
        //     mainHost:'主机',
        //     operateAddress:'操作地点',
        //     status:'操作状态',
        //     time:'操作时间',
        //     // operate:'操作'
        // }, {
        //     logNumber: '2016-05-03',
        //     sysModule: '王小虎',
        //     operateType: '上海市普陀区金沙江路 1518 弄',
        //     operator:'操作人员',
        //     department:'XX部门',
        //     mainHost:'主机',
        //     operateAddress:'操作地点',
        //     status:'操作状态',
        //     time:'操作时间',
        //     // operate:'操作'
        // }, {
        //    logNumber: '2016-05-03',
        //     sysModule: '王小虎',
        //     operateType: '上海市普陀区金沙江路 1518 弄',
        //     operator:'操作人员',
        //     department:'XX部门',
        //     mainHost:'主机',
        //     operateAddress:'操作地点',
        //     status:'操作状态',
        //     time:'操作时间',
        //     // operate:'操作'
        // }, {
        //     logNumber: '2016-05-03',
        //     sysModule: '王小虎',
        //     operateType: '上海市普陀区金沙江路 1518 弄',
        //     operator:'操作人员',
        //     department:'XX部门',
        //     mainHost:'主机',
        //     operateAddress:'操作地点',
        //     status:'操作状态',
        //     time:'操作时间',
        //     // operate:'操作'
        // }],
    };
  },
  components: {
	  Search
  },
  computed: {

  },
  created() {
      this.queryDate();
  },
  methods: {
    onSubmit() {
		this.queryDate();
	},
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    queryDate() {//查询
        queryGwPage({
            postCode:this.sizeForm.code,
            postName:this.sizeForm.name,
            status:this.sizeForm.region
        }).then(res => {
            this.tableData = res.rows;
            this.tableData.forEach((v,i) =>{
                v.status = v.status == 0 ? '正常' : '停用';
            });
			console.log(this.tableData)
		});
    },
    handleClick(rows){
        console.log(rows);
    },
    deleted(rows){//删除
        this.$confirm('确认删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteGwPage({str:rows.postId}).then(res => {
                console.log(1);
            });
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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
        width:100%;
        display: flex;
        .table {
            width: 100%;
            height: 100%;
            background:url(../../assets/mainTreeR.png)no-repeat;
            background-size: 100% 100%;
            padding: 0 1.5% 1.5% 1.5%;
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
    .normal{
        color: #45EBA7 !important;
    }
    .stop{
        color:#CB3203 !important;
    }
}
.post-container /deep/.cell span.editor {
    padding: 10px;
    cursor: pointer;
}
.post-container /deep/.cell span:nth-child(1) {
    color: #45EBA7;
}
.post-container /deep/.cell span:nth-child(2) {
    color: #CB3203;
}
.post-container /deep/.cell span:nth-child(3) {
    color: #E6BF06;
}
.post-container /deep/.el-form-item__content,.el-button{
    margin-left: 0 ;
}
.post-container /deep/.el-form-item:nth-child(4){
    width:0;
}
.post-container /deep/ .el-message-box__btns button:nth-child(2){
    background: transparent !important;
}
.post-container /deep/ .el-button--primary {
    background: url(../../assets/buttonbg.png) !important;
}

</style>
<style>
.el-message-box{
    background: #05254B !important;
    border: none;
}
</style>
