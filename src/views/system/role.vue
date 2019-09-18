<template>
	<div class="role">
		<div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="角色名称">
						<el-input v-model="sizeForm.roleName"></el-input>
					</el-form-item>
					<el-form-item label="权限字符">
						<el-input v-model="sizeForm.roleKey"></el-input>
					</el-form-item>
					<el-form-item label="角色状态">
						<el-select v-model="sizeForm.status" placeholder="所有"  style="width:245px;">
						<el-option label="正常" value="0"></el-option>
						<el-option label="禁用" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-col :span="11">
						<el-date-picker type="date" placeholder="开始时间" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>
						</el-col>
						<el-col class="line" :span="2">-</el-col>
						<el-col :span="11">
						<el-date-picker type="date" placeholder="结束时间" v-model="sizeForm.date2" style="width: 100%;"></el-date-picker>
						</el-col>
					</el-form-item>
					<el-form-item size="large">
						<el-button type="primary" @click="onSubmit">搜索</el-button>
						<el-button type="primary" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="dashboard-content">
			 <div class="table-content">
				 <div class="tableHead">
					<div class="button" @click="dialogFormVisible = true">新增</div>
					<div class="button"  @click="batchDelete()">删除</div>
					<div class="button">修改</div>
					<div class="button">导出</div>
					<div class="operation">
						<div><span></span></div>
						<div><span></span></div>
						<div><span></span></div>
						<div><span></span></div>
					</div>
				</div>
				<div class="table">
					<el-table
						ref="multipleTable"
						:data="tableDataList"
						tooltip-effect="dark"
						style="width: 100%"
						@selection-change="handleSelectionChange">
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="角色编号" prop="roleId" >
						</el-table-column>
						<el-table-column
						label="角色名称"
						prop="roleName"
						>
						</el-table-column>
						<el-table-column
						prop="roleKey"
						label="权限字符"
						>
						</el-table-column>
						<el-table-column
						prop="roleSort"
						label="显示顺序"
						show-overflow-tooltip>
						</el-table-column>
						<el-table-column
						label="角色状态"
						width="120"
                        >
						<template slot-scope="scope">
							<el-switch
							v-model="scope.row.surStatus">
							</el-switch>
						</template>
						</el-table-column>
						<el-table-column
						prop="createTime"
						label="创建时间"
						show-overflow-tooltip>
						</el-table-column>
						<el-table-column
						label="操作"
						width="280"
                        >
						<template slot-scope="scope">
							<span @click="handleClick(scope.row)">编辑</span>
							<span>数据权限</span>
							<span>分配用户</span>
							<span @click="deleted(scope.row.roleId)">删除</span>
						</template>
						</el-table-column>
					</el-table>
				</div>
				 <el-pagination
					style="text-align:right;margin-top:2%;"
					background
					layout="prev, pager, next, jumper,total"
					@size-change="handleSizeChange($event, query)"
					@current-change="handleCurrentChange($event, query)"
					:current-page="queryList.pageNum"
					:page-size="queryList.pageSize"
					:total="total"
				 ></el-pagination>
			</div>
		</div>
		<el-dialog title="基本信息" :visible.sync="dialogFormVisible">
			<el-form :model="form" style="height:308px;">
				<el-form-item label="角色名称：" :label-width="formLabelWidth">
					<el-input v-model="form.surLoginName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限字符：" :label-width="formLabelWidth">
					<el-input v-model="form.surDeptId" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序：" :label-width="formLabelWidth">
					<el-input v-model="form.surPhoneNumber" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态：" :label-width="formLabelWidth">
					<el-radio v-model="form.surSex" label="1">男</el-radio>
					<el-radio v-model="form.surSex" label="2">女</el-radio>
				</el-form-item>
				<el-form-item label="备注：" :label-width="formLabelWidth">
					<el-input v-model="form.surUserName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单权限" :label-width="formLabelWidth">
					<el-input v-model="form.surPassword" autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="用户状态" :label-width="formLabelWidth">
					<el-switch
						v-model="form.value1">
					</el-switch>
				</el-form-item>
				<el-form-item label="岗 位" :label-width="formLabelWidth">
					<el-select v-model="form.region" placeholder="请选择岗位">
						<el-option label="董事长" value="董事长"></el-option>
						<el-option label="项目经理" value="项目经理"></el-option>
						<el-option label="人力资源" value="人力资源"></el-option>
						<el-option label="普通员工" value="普通员工"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="角色" :label-width="formLabelWidth">
					<el-radio v-model="surStatus" label="1">操作员</el-radio>
					<el-radio v-model="surStatus" label="2">管理员</el-radio>
				</el-form-item> -->
			</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button  @click="preservation" type="primary">保 存</el-button>
			<el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
		</div>
		</el-dialog>
	</div>
</template>
<script>
import { getSysRoleList,deleteRoleGwPage } from '@/api';
export default {
  data() {
    return {
		tableData: [],
		value1: true,
		multipleSelection: [],
		formLabelWidth: '120px',
		dialogFormVisible:false,
		sizeForm: {
			roleName: '',
			roleKey: '',
			date1: '',
			date2: '',
			status: '',
		},
		form: {
          region: '',
          delivery: false,
		  value1:true,
		  surRemark:'',
		  surUserName:'',
		  surPhoneNumber:'',
		  surRemark:'',
		  surEmail:'',
		  surLoginName:'',
		  surPassword:'',
		  surDeptId:'',
        },
		pageShow:true,
		current:1,
		pageSize:5,
		total:10,
    };
  },
  components: {
  },
  created() {
	  this.queryDate();
  },
  methods: {
	  handleClick(row) {
        console.log(row);
      },
	  toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
	  },
	  //搜索按钮
	  onSubmit() {
		console.log('submit!');
	  },
	  //重置按钮
	  reset() {
		this.sizeForm.roleName = '';
		this.sizeForm.roleKey = '';
		this.sizeForm.date1 = '';
		this.sizeForm.date2 = '';
		this.sizeForm.status = '';
	  },
	  queryDate() {
		this.sizeForm.pageNum=this.current;
		this.sizeForm.pageSize=this.pageSize;
		getSysRoleList(this.sizeForm).then(res => {
			this.tableDataList = res.rows;
			this.total = parseInt(res.total);
		});
	  },
	  exported(){//导出
		window.location.href = 'http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel';
	  },
	  batchDelete(){//批量删除
	  console.log(this.multipleSelection)
        let selectArr = [];
        if(typeof(this.multipleSelection) == "undefined"){
            this.$message({
                message: '请选择需要删除的数据！',
                type: 'warning'
            });
        }else{
            this.multipleSelection.forEach((v,i) => {
                selectArr.push(v.roleId);
            })
            this.deleted(selectArr.join(','));
        }
	  },
	  revise(){
			if(typeof(this.multipleSelection) == "undefined"){
				this.$message({
					message: '请选择需要修改的数据！',
					type: 'warning'
				});
			}else{
				this.dialogFormVisible = true;
				this.form = this.multipleSelection.pop();//获取最后一条
				this.obj = this.multipleSelection.pop();
			}
	  },
	  deleted(ids){//删除
			this.$confirm('确认删除该数据?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
				deleteRoleGwPage({roleId:ids}).then(res => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.queryDate();
				});  
			}).catch(() => {
			this.$message({
				type: 'info',
				message: '已取消删除'
			});          
			});
	  },
	  preservation(){ 新增保存

	  },
	  handleSizeChange: function(current) {
		console.log(current)
		this.current = current;
		this.queryDate();
	  },
	  editor(rows){//编辑
		this.dialogFormVisible = true;
		this.form = rows;
		this.obj = rows;
	  },
  }
};

</script>
<style lang="scss" scoped>
	.role {
		color: #fff;
		height: 100%;
		.tabs-search {
			height: 175px;
			margin-bottom: 12px;
			background:url(../../assets/images/tabs-search-bg.png);
            background-size: 100% 100%;
			.search {
				width: 100%;
				height: 150px;
				padding: 28px 20px;
			}
		}
		.dashboard-content {
			height: calc(100% - 187px);
			width:100%;
			display: flex;
			.organization {
				width: 223px;
				height: 100%;
			}
			.table-content {
				width: 100%;
				height: 100%;
				background:url(../../assets/images/table-content-bg.png);
				background-size: 100% 100%;
				padding: 22px 34px;
				box-sizing: border-box;
				.tableHead {
					height: 70px;
					.button {
						width: 90px;
						height: 36px;
						line-height: 36px;
						background: #05254B;
						margin-right: 20px;
						float: left;
						border-radius:4px;
						text-align: right;
						padding-right: 20px; 
						cursor: pointer;
					}
					.button::before {
						content: '';
						width: 14px;
						height: 14px;
						display: inline-block;
						background-image: url(../../assets/icon.png);
						background-position: -57px 792px;
						margin-right: 6px;
					}
					.button:nth-child(2):before {
						background-position: -57px 770px;
					}
					.button:nth-child(3):before {
						background-position: -57px 749px;
					}
					.button:nth-child(4):before {
						background-position: -57px 726px;
					}
					.button:nth-child(5):before {
						background-position: -57px 704px;
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
				}
				.table {
					width: 100%;
					height: calc(100% - 165px);
					overflow:auto;
				}
			}
		}
	}
.login-user{
		margin-bottom: 20px;
		text-align: center;
        span{
          text-align: center;
          font-size:18px;
          color:#63ACDF;
          margin: 0 5%;
        }
        img{
          vertical-align: bottom;
        }
	  }
	 .role /deep/ .el-dialog {
		  .el-dialog__header {
			text-align: center;
			.el-dialog__title {
			  text-align: center;
			  color: #4BAEFD;
			}
			.el-dialog__title:before {
				content:'';
				display: inline-block;
				background-image: url(../../assets/login-left.png);
				background-size: 100% 100%;
				width:91px;
				height: 13px;
				margin-right: 12px; 
			}
			.el-dialog__title:after {
				content:'';
				display: inline-block;
				background-image: url(../../assets/login-right.png);
				background-size: 100% 100%;
				width:91px;
				height: 13px;
				margin-left: 12px; 
			}
			.el-dialog__headerbtn {
				top: 80px;
    			right: 80px;
				.el-dialog__close {
					color: #FFF;
					font-size: 30px;
				}
			}
		  }
		  .el-dialog__body {
				padding:10px 20px;
				.el-form {
					padding:  20px 0px 0px;
					.el-radio {
						color: #FFF;
						margin-right: 50px; 
					}
				}
		  }
		   .el-dialog__body::before {
				content: '基本信息'; 
				width: 100%;
				height: 34px;
				display: inline-block;
				border-bottom: 1px dashed rgba(75,174,253,1); 
				color: #63ACDF;
				font-size: 13px;
			}
	  }
	 
	 .role /deep/ .dialog-footer {
		  text-align: center;
	  }
.role /deep/.cell span:nth-child(1) {
	color: #45EBA7;
}
.role /deep/.cell span:nth-child(2) {
	color: #E6BF06;
}
.role /deep/.cell span:nth-child(3) {
	color: #21b9bb;
}
.role /deep/.cell span:nth-child(4) {
	color: #CB3203;
}
</style>
<style>
	.el-switch {
		display: inline-flex;
		align-items: center;
		position: relative;
		font-size: 14px;
		line-height: 24px;
		height: 24px;
		vertical-align: middle;
	}
	.el-switch__input {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
		margin: 0;
	}
	.el-switch.is-checked .el-switch__core {
		border-color: #4BAEFD;
		background-color: #4BAEFD;
	}
	.el-switch.is-disabled .el-switch__core, .el-switch.is-disabled .el-switch__label {
		cursor: not-allowed;
	}
	.el-switch__core {
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
	.el-switch.is-checked .el-switch__core:after {
		left: 88%;
		margin-left: -17px;
	}
	.el-switch__core:after {
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
	.cell span {
		cursor: pointer;
	}
	
	*::-webkit-scrollbar {
		width: 16px;
	}
	*::-webkit-scrollbar-track {
		background-color: #05254B;
		border:1px solid #02439D;
	}

	*::-webkit-scrollbar-thumb {
		background-color: #0154C7;
	}
</style>
<style>
    .el-form-item {
        width: 325px;
        color: #fff;
        float: left;
        height: 60px;
    }
    .el-form-item:nth-child(4) {
        width:325px;
    }
    .el-form-item:nth-child(4) .el-form-item__content div:nth-child(1) {
        width: 45%;
        float: left;
    }
    .el-form-item:nth-child(4) .el-form-item__content div:nth-child(2) { 
        width: 10%;
        float: left;
        text-align: center;
    }
    .el-form-item:nth-child(4) .el-form-item__content div:nth-child(3) {
        width: 45%;
        float: left;
    }
    .el-form-item__label {
        float: left;
        font-size: 14px;
        line-height: 26px !important;
        color: #FFF;
    }
    .el-form-item--large {
        width: 660px;
    }
    .el-button {
        margin-left: 514px;
        width: 120px;
        height: 35px;
        background: url(../../assets/buttonbg.png);
        background-size: 100% 100%;
        border:none;
        color: #fff;
    }
    .el-input__inner {
        background-color: #05254B !important; 
        border: 1px solid #02439D !important;
    }
    .el-picker-panel {
        color: #606266;
        border: 1px solid #02439D;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        background: #05254B;
        border-radius: 4px;
        line-height: 30px;
        margin: 5px 0;
    }
    .el-picker-panel__footer {
        border-top: 1px solid #e4e4e4;
        padding: 4px;
        text-align: right;
        background-color: #fff;
        position: relative;
        font-size: 0;
    }
    .el-popper[x-placement^=top] .popper__arrow {
        bottom: -6px;
        left: 50%;
        margin-right: 3px;
        border-top-color: #ebeef5;
        border-bottom-width: 0;
    }
    .el-date-picker__header {
        margin: 12px;
        text-align: center;
    }
    .el-date-picker .el-picker-panel__content {
        width: 292px;
    }
    .el-picker-panel__content {
        position: relative;
        margin: 15px;
    }
    .el-date-picker table {
        table-layout: fixed;
        width: 100%;
    }
    .el-date-table {
        font-size: 12px;
        user-select: none;
    }
    .el-year-table {
        font-size: 12px;
        margin: -1px;
        border-collapse: collapse;
    }
    .el-month-table {
        font-size: 12px;
        margin: -1px;
        border-collapse: collapse;
    }
    .el-date-table td {
        width: 32px;
        height: 30px;
        padding: 4px 0;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        position: relative;
    }
    .el-date-table td.next-month, .el-date-table td.prev-month {
        color: #c0c4cc;
    }
    .el-date-table td div {
        height: 30px;
        padding: 3px 0;
        box-sizing: border-box;
    }
    .el-date-table td span {
        width: 24px;
        height: 24px;
        display: block;
        margin: 0 auto;
        line-height: 24px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
    }
    .el-date-table td.today span {
        color: #fff;
        font-weight: 700;
    }
    .el-date-table td.available:hover {
        color: #409eff;
    }
    .el-date-table td.next-month, .el-date-table td.prev-month {
        color: #DBDCE3;
    }
    .el-date-picker__header-label,
    .el-date-table th,
    .el-date-table td,
    .el-icon-arrow-right:before,
    .el-icon-d-arrow-right:before, 
    .el-icon-d-arrow-left:before,
    .el-icon-arrow-left:before {
        color: #4BAEFD;
    }
</style>

