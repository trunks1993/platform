<template>
	<div class="menu">
		<div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="角色名称">
						<el-input v-model="sizeForm.name"></el-input>
					</el-form-item>
					<el-form-item label="角色状态">
						<el-select v-model="sizeForm.region" placeholder="所有"  style="width:245px;">
						<el-option label="显示" value="0"></el-option>
						<el-option label="隐藏" value="1"></el-option>
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
							row-key="menuId"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						>
					<el-table-column
						type="selection">
						</el-table-column>
						<el-table-column
						v-for="(item,index) in tableList"
						:key="index"
						:label="item.label"
						:prop="item.prop"
						></el-table-column>
						<el-table-column label="操作">
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
import { getMenuTree } from '@/api';
export default {
  data() {
    return {
		tableList: [
        {
          label: "菜单名称",
          prop: "menuName"
        },
        {
          label: "排序",
          prop: "name"
        },
        {
          label: "请求地址",
          prop: "path"
        },
        {
          label: "类型",
          prop: "operator"
        },
        {
          label: "可见",
          prop: "state"
        },
        {
          label: "权限标识",
          prop: "state"
        }
      ],
		tableData: [],
		value1: true,
		multipleSelection: [],
		sizeForm: {
			name: '',
			region: '',
        }
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
	  queryDate() {
		   getMenuTree(this.sizeForm).then(res => {
			   console.log(res)
				this.tableData = res;
		   });
	  },
	  onSubmit() {
		this.queryDate();
	  }
  }
};

</script>
