<template>
	<div class="dept">
		<div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="角色名称">
						<el-input v-model="sizeForm.name"></el-input>
					</el-form-item>
					<el-form-item label="角色状态">
						<el-select v-model="sizeForm.region" placeholder="所有"  style="width:245px;">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item size="large">
						<el-button type="primary" @click="onSubmit">搜索</el-button>
						<el-button type="primary" @click="onSubmit">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="dashboard-content">
			 <div class="table-content">
				 <div class="tableHead">
					<div class="button">新增</div>
					<div class="button">修改</div>
					<div class="button">展开/折叠</div>
					<div class="operation">
						<div><span></span></div>
						<div><span></span></div>
						<div><span></span></div>
						<div><span></span></div>
					</div>
				</div>
				<div class="table">
					<el-table
							:data="tableData"
							style="width: 100%;margin-bottom: 20px;"
							row-key="sdtDeptId"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
					<el-table-column
						type="selection"
						>
						</el-table-column>
						<el-table-column
						v-for="(item,index) in tableList"
						:key="index"
						:label="item.label"
						:prop="item.prop"
						></el-table-column>
						<el-table-column label="操作">
						<template slot-scope="scope">
							<span @click="handleClick(scope.row)">编辑</span>
							<span>新增</span>
							<span>删除</span>
						</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getSysDeptTreeData } from '@/api';
export default {
  data() {
    return {
		tableList: [
        {
          label: "菜单名称",
          prop: "sdtDeptName"
        },
        {
          label: "排序",
          prop: "sdtDelFlag"
        },
        {
          label: "状态",
          prop: "sdtStatus"
        },
        {
          label: "创建时间",
          prop: "sdtCreateTime"
        }
      ],
		tableData: [
        {
          id: 1,
          date: "个人",
          name: "第二根半价套餐",
          address: "是兄弟就来割",
		  operator: "铁手",
		  type:'目录',
		  solo:'显示',
          state: "无痛",
          children: [
            {
              id: 11,
              date: "用户管理",
              name: "第二根半价套餐",
              alias: "是兄弟就来割",
              operator: "铁手",
              state: "无痛",
              children: [
                {
                  id: 12,
                  date: "角色管理",
                  name: "第二根半价套餐",
                  alias: "是兄弟就来割",
                  operator: "铁手",
                  state: "无痛"
                }
              ]
            }
          ]
        },
        {
          id: 3,
		  date: "全院",
		  name: "第二根半价套餐",
		  alias: "是兄弟就来割",
		  operator: "铁手",
		  state: "无痛",
          children: [
            {
			  id: 31,
			  date: "全院社团",
              name: "第二根半价套餐",
              alias: "是兄弟就来割",
              operator: "铁手",
              state: "无痛"
            },
            {
			  id: 41,
			  date: "全院管理",
              name: "第二根半价套餐",
              alias: "是兄弟就来割",
              operator: "铁手",
              state: "无痛"
            }
          ]
        }
      ],
		value1: true,
		multipleSelection: [],
		sizeForm: {
			name: '',
			region: '',
			date1: '',
			date2: '',
			delivery: false,
			type: [],
			resource: '',
			desc: ''
        }
    };
  },
  components: {
  },
  created() {
	  this.Sysuser();
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
	  Sysuser() {
		getSysDeptTreeData().then(res => {
			this.tableData = res;
		});
	  },
	  onSubmit() {
		console.log('submit!');
	  }
  }
};

</script>
<style lang="scss" scoped>
	.dept {
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
					.button:nth-child(3) {
						width: 130px;
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
	.el-table_1_column_1 {
		width: 48px !important;
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
        width: 325px !important;
    }
    .el-button {
        width: 120px;
        height: 35px;
        background: url(../../assets/buttonbg.png);
        background-size: 100% 100%;
        border:none;
		color: #fff;
		margin-left: 10px !important;
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

