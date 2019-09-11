<template>
	<div class="user">
		<div class="tabs-search">
			<Search></Search>
		</div>
		<div class="dashboard-content">
			 <div class="organization"></div>
			 <div class="table-content">
				 <div class="tableHead">
					<div class="button">新增</div>
					<div class="button">删除</div>
					<div class="button">修改</div>
					<div class="button">导入</div>
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
						:data="tableData"
						tooltip-effect="dark"
						style="width: 100%"
						@selection-change="handleSelectionChange">
						<el-table-column
						type="selection"
						width="55">
						</el-table-column>
						<el-table-column
						label="用户ID"
						width="120">
						<template slot-scope="scope">{{ scope.row.date }}</template>
						</el-table-column>
						<el-table-column
						prop="name"
						label="登录名称"
						width="120">
						</el-table-column>
						<el-table-column
						prop="address"
						label="用户名称"
						show-overflow-tooltip>
						</el-table-column>
						<el-table-column
						prop="address"
						label="部门"
						show-overflow-tooltip>
						</el-table-column>
						<el-table-column
						prop="address"
						label="手机"
						show-overflow-tooltip>
						</el-table-column>
						<el-table-column
						label="用户状态"
						width="120"
                        >
						<template slot-scope="scope">
							<el-switch
							v-model="value1">
							</el-switch>
						</template>
						</el-table-column>
						<el-table-column
						prop="address"
						label="创建时间"
						show-overflow-tooltip>
						</el-table-column>
						<el-table-column
						label="操作"
						width="220"
                        >
						<template slot-scope="scope">
							<span @click="handleClick(scope.row)">查看</span>
							<span>编辑</span>
							<span>重置</span>
						</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Search from '../layout/components/Search'
export default {
  name: 'main',
  data() {
    return {
		tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普'
		}, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普'
		}],
		value1: true,
        multipleSelection: []
    };
  },
  components: {
	  Search
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
      }
  }
};

</script>
<style lang="scss">
	.user {
		color: #fff;
		height: 100%;
		.tabs-search {
			height: 187px;
		}
		.dashboard-content {
			height: calc(100% - 187px);
			display: flex;
			.organization {
				width: 223px;
				height: 100%;
			}
			.table-content {
				width: calc(100% - 223px);
				height: 100%;
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
			margin: 10px;
			cursor: pointer;
	}
	.cell span:nth-child(1) {
		color: #45EBA7;
	}
	.cell span:nth-child(2) {
		color: #CB3203;
	}
	.cell span:nth-child(3) {
		color: #E6BF06;
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

