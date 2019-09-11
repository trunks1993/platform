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
					<div class="operation"></div>
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
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    };
  },
  components: {
	  Search
  },
  methods: {

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
				}
			}
		}
	}
</style>

