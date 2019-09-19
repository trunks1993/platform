<template>
	<div class="dept">
		<div class="tabs-search">
			<div class="search">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="部门名称">
						<el-input v-model="sizeForm.sdtDeptName"></el-input>
					</el-form-item>
					<el-form-item label="部门状态">
						<el-select v-model="sizeForm.sdtStatus" placeholder="所有"  style="width:245px;">
						<el-option label="正常" value="0"></el-option>
						<el-option label="停用" value="1"></el-option>
						</el-select>
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
							<span @click="editor(scope.row)">编辑</span>
							<span >新增</span>
							<span @click="deleted(scope.row.sdtDeptId)">删除</span>
						</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<el-dialog title="基本信息" :visible.sync="dialogFormVisible">
			<el-form :model="form" style="height:308px;">
				<el-form-item label="上级部门：" :label-width="formLabelWidth">
					<el-input v-model="form.sdtDeptPid" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门名称：" :label-width="formLabelWidth">
					<el-input v-model="form.sdtDeptName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="显示排序：" :label-width="formLabelWidth">
					<el-input v-model="form.sdtOrderNum" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="负责人：" :label-width="formLabelWidth">
					<el-input v-model="form.sdtLeader" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：" :label-width="formLabelWidth">
					<el-input v-model="form.sdtPhone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：" :label-width="formLabelWidth">
					<el-input v-model="form.sdtEmail" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门状态" :label-width="formLabelWidth">
					<el-radio v-model="form.sdtStatus" label="0">正常</el-radio>
					<el-radio v-model="form.sdtStatus" label="1">停用</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click="preservation" type="primary">保 存</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { getSysDeptTreeData,searchSysDeptList,postSysDeptAdd,deleteSysDeptRomove } from '@/api';
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
	  	form: {
		  sdtDeptPid:'',
		  sdtDeptName:'',
		  sdtOrderNum:'',
		  sdtLeader:'',
		  sdtPhone:'',
		  sdtEmail:'',
		  sdtStatus:'1',
        },
		tableData: [],
		formLabelWidth:'120px',
		dialogFormVisible:false,
		value1: true,
		multipleSelection: [],
		sizeForm: {
			sdtStatus:'',
			sdtDeptName: '',
        }
    };
  },
  components: {
  },
  created() {
	  this.queryDate();
  },
  methods: {
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
	  queryDate() { //获取分页数据
		getSysDeptTreeData().then(res => {
			this.tableData = res;
		});
	  },
	  onSubmit() { 
		console.log(this.sizeForm);
		console.log('submit!');
		searchSysDeptList(this.sizeForm).then(res => {
			this.tableData = res;
			console.log(this.tableData)
		})
	  },
	  reset() { //重置输入框数据
		this.sizeForm.sdtDeptName = '';
		this.sizeForm.sdtStatus = '';
	  },
	  preservation(){ //新增保存
		postSysDeptAdd(this.form).then(res=>{
			console.log(res)
			this.$message({
				type: 'success',
				message: '新增成功!'
			});
			this.dialogFormVisible = false;
		})
	  },
	  editor(rows){//编辑
		this.dialogFormVisible = true;
		this.form = rows;
		this.obj = rows;
	  },
	  deleted(ids){//删除
			this.$confirm('确认删除该数据?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
				deleteSysDeptRomove({sdtDeptId:ids}).then(res => {
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
  }
};

</script>
