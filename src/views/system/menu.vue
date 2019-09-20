<template>
  <div class="common-container">
     <div class="filter-container" style="height: 159px;background: url(../img/tabs-search-bg.e34485a0.png);background-size: 100% 100%;padding: 20px;">
				<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
					<el-form-item label="菜单名称">
						<el-input v-model="sizeForm.menuName"></el-input>
					</el-form-item>
					<el-form-item label="菜单状态">
						<el-select v-model="sizeForm.visible" placeholder="所有"  style="width:245px;">
						<el-option label="显示" value="0"></el-option>
						<el-option label="隐藏" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item size="large">
						<el-button type="primary" @click="search">搜索</el-button>
						<el-button type="primary" @click="onSubmit">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
    <div class="app-wrapper">
      <div class="content-box">
        <div class="content-box-tool">
        <el-button type="tool" icon="el-icon-plus" @click="saveAskfather">新增</el-button>
        <el-button type="tool" icon="el-icon-editor" @click="revise">修改</el-button>
        <!-- <el-button type="tool" icon="el-icon-export">展开/折叠</el-button> -->
      </div>
        <div class="content-box-table">
          <el-table
            :data="tableDataList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="menuId"
            @selection-change="handleSelectionChange"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              v-for="(item,index) in tableList"
              :key="index"
              :label="item.label"
              :prop="item.prop"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button  type="text" @click="editor(scope.row)">编辑</el-button>
                <el-button type="text" @click="saveAskhz(scope.row.surUserId)">新增</el-button>
                <el-button type="text-warn" @click="deleted(scope.row.menuId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="基本信息" :visible.sync="dialogFormVisible">
       <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt="">
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt="">
      </div>
      <el-form :model="form"  :inline="true">
        <el-form-item label="上级菜单：" :label-width="formLabelWidth">
          <el-input v-model="form.parentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型：" :label-width="formLabelWidth">
          <el-input v-model="form.menuType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称：" :label-width="formLabelWidth">
          <el-input v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求地址：" :label-width="formLabelWidth">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标识：" :label-width="formLabelWidth">
          <el-input v-model="form.perms" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示排序：" :label-width="formLabelWidth">
          <el-input v-model="form.orderNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标：" :label-width="formLabelWidth">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态：" :label-width="formLabelWidth">
          <el-switch v-model="form.visible"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="preservation" type="primary">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog :visible.sync="dialogVisible">
        <div slot="title" class="dailog-title">
            <img src="../../assets/images/icon-title-left.png" alt />
            <span class="title">系统提示信息</span>
            <img src="../../assets/images/icon-title-right.png" alt />
        </div>
        <div style="width:100%;color:#63ACDF;text-align:center;">确定要删除列表数据吗？</div>
        <div slot="footer" style="text-align: center;">
            <el-button type="primary" @click="sure">确 定</el-button>
            <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMenuTree,putMenuAdd,getMenuDelete,getMenuList,getQueryByList,putMenuEdit  } from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
export default {
  data() {
    return {
	 baseExpApi:
	 "http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel",
      fqForm: [
        {
          fiAttr: {
            label: "角色名称"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "roleName"
        },
        {
          fiAttr: {
            label: "角色状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "status",
          option: [
            { label: "所有", value: "" },
            { label: "正常", value: 0 },
            { label: "停用", value: 1 }
          ]
        }
        // {
        //   fiAttr: {
        //     label: "创建时间"
        //   },
        //   el: "date-picker",
        //   bindkey: "surStatus"
        // }
      ],
      tableList: [
        {
          label: "菜单名称",
          prop: "menuName"
        },
        {
          label: "排序",
          prop: "orderNum"
        },
        {
          label: "请求地址",
          prop: "path"
        },
        {
          label: "类型",
          prop: "menuType"
        },
        {
          label: "可见",
          prop: "state"
        },
        {
          label: "权限标识",
          prop: "perms"
        }
      ],
      tableDataList: [],
      value1: true,
      multipleSelection: [],
      dialogFormVisible: false,
      formLabelWidth:'120px',
      form: {
        parentId: "",
        menuName: "",
        systemId: "",
        parentId: "",
        orderNum: "",
        path: "",
        menuType: "",
        visible: "",
        perms: "",
        icon: "",
        component: "",
      },
      sizeForm: {
        menuName: "",
        visible: ""
    },
    dialogVisible:false,
    ids:'',
	  isSearch:true,
    };
  },
  components: {
    FilterQueryForm
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
    deleted(ids) {
      //删除
      this.dialogVisible = true;
      this.ids = ids;
    },
    sure(){//确认删除
        getMenuDelete({ menuId: this.ids }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.dialogVisible = false;
            this.query();
          });
    },
    revise() {
      if (typeof this.multipleSelection == "undefined"  || this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择需要修改的数据！",
          type: "warning"
        });
      } else {
        console.log(this.multipleSelection)
        this.dialogFormVisible = true;
        this.form = this.multipleSelection.pop(); //获取最后一条
        this.obj = this.multipleSelection.pop();
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    onSubmit() {
      this.queryDate();
    },
    search() {
      console.log(this.sizeForm);
      getQueryByList(this.sizeForm).then(res => {
        console.log(res)
        this.tableDataList = res.rows;
        res.rows.forEach((item)=>{
          console.log() 
          if(item.menuType == "M"){
             this.tableDataList.menuType = "目录";
          }else if(item.menuType == "C"){
             this.tableDataList.menuType = "菜单";
          }else if(item.menuType == "F"){
             this.tableDataList.menuType = "按钮";
          }
        })
        console.log(this.tableData);
      });
    },
    queryDate() {
		  getMenuList(this.sizeForm).then(res => {
			  console.log(res)
        res.forEach((item)=>{
          console.log() 
          if(item.menuType == "M"){
             res.menuType = "目录";
          }else if(item.menuType == "C"){
             res.menuType = "菜单";
          }else if(item.menuType == "F"){
             res.menuType = "按钮";
          }
        })
        this.tableDataList = res;
		  });
    },
    preservation(){
        if(JSON.stringify(this.obj) == '{}'){//新增
                this.addAsk();
         }else{//编辑
                this.saveAsk();
         }  
    },
    addAsk(){
       this.form.visible = this.form.visible == true ? 0:1 
       putMenuAdd(this.form).then(res=>{
            this.$message({
              type: "success",
              message: "新增成功!"
            });
            this.dialogFormVisible = false;
        })
    },
    saveAsk(){
      // console.log(this.form)
      this.form.visible = this.form.visible == true ? 0:1 
      // this.form.systemId = this.form.systemId;
      let obj = {
          menuId: this.form.menuId,
          parentId: this.form.parentId,
          menuName: this.form.menuName,
          systemId: this.form.systemId,
          parentId: this.form.parentId,
          orderNum:this.form.orderNum,
          path: this.form.path,
          menuType: this.form.menuType,
          visible: this.form.visible,
          perms: this.form.perms,
          icon: this.form.icon,
          component:this.form.component,
      }
      console.log(this.form)
        putMenuEdit(obj).then(res=>{
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.dialogFormVisible = false;
        })
    },
    saveAskfather(){
      this.dialogFormVisible = true;
      this.form = {};
      this.obj = {};
    },
    saveAskhz(rows){
      this.dialogFormVisible = true;
       this.form.parentId = rows.menuId; 
       this.obj = {};
    },
    editor(rows) {
      console.log(rows)
      //编辑
      this.dialogFormVisible = true;  
      this.form = rows;
      this.obj = rows;
    }
  }
};
</script>
