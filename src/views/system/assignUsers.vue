<template>
  <div class="common-container">
     <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="false"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterFilter="handleFilter($event, querySearch)"
      @handleVisible="e => filterVisible = e"
    ></FilterQueryForm>
    <div class="app-wrapper" :style="{height: filterVisible ? 'calc(100% - 115px)': 'calc(100% - 40px)'}">
      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="roleAdds">添加用户</el-button>
          <el-button type="tool" icon="el-icon-close" @click="batchDelete">批量取消授权</el-button>
          <el-button type="tool" icon="el-icon-editor" @click="revise">关闭</el-button>
          <!-- <el-button type="tool" icon="el-icon-export" @click="handleExport(baseExpApi)">导出</el-button> -->
        </div>
        <div class="content-box-table">
          <el-table
            ref="multipleTable"
            :data="tableDataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="登录名称" prop="surLoginName"></el-table-column>
            <el-table-column label="用户名称" prop="surUserName"></el-table-column>
            <el-table-column label="邮箱" prop="surEmail"></el-table-column>
            <el-table-column prop="surPhoneNumber" label="手机" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户状态" prop="surStatus">
              <template slot-scope="scope">
                 <span
                  :style="{color:scope.row.surStatus == '0' ? '#45eba7' : '#cb3203'}"
                >{{scope.row.surStatus == '0' ? '正常' : '停用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="surCreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text-warn" @click="deleted(scope.row.surUserId)">取消授权</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content-box-pagination">
          <el-pagination
            style="text-align:right;margin-top:2%;"
            background
            layout="prev, pager, next"
            @size-change="handleSizeChange($event, query)"
            @current-change="handleCurrentChange($event, query)"
            :current-page="queryList.pageNum"
            :page-size="queryList.pageSize"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogFormVisible">
      <div slot="title" class="dailog-title">
        <img src="../../assets/images/icon-title-left.png" alt />
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt />
      </div>
      <el-form :model="form" :inline="true">
        <el-form-item label="登录名称" :label-width="'120px'">
          <el-input v-model="form.surLoginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="'120px'">
          <el-input v-model="form.surPhoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item size="large" style="margin-left:120px">
          <el-button type="primary" @click="unSearch">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="padding: 0px 40px">
        <el-table
        ref="multipleTable"
        :data="unTableDataList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChangeSon"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="登录名称" prop="surLoginName"></el-table-column>
        <el-table-column label="用户名称" prop="surUserName"></el-table-column>
        <el-table-column label="邮箱" prop="surEmail"></el-table-column>
        <el-table-column prop="surPhoneNumber" label="手机" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户状态" prop="surStatus"></el-table-column>
        <el-table-column prop="surCreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
      </el-table>
      </div>
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
      <div style="width:100%;color:#63ACDF;text-align:center;">确认要取消该用户角色吗？</div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="sure">确 定</el-button>
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSelectByUser,
  getInsertUserRole,
  getSysRoleList,
  getMenuList,
  deleteRoleGwPage,
  getDeleteUserRole,
  getAllocatedList,
  getUnallocatedList,
} from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      tableDataList: [],
      unTableDataList:[],
      baseExpApi:
        "http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel",
      data: [],
      dialogFormVisible: false,
      dialogVisible: false,
      form: {
        surLoginName: "",
        surPhoneNumber: "",
      },

      pageShow: true,
      current: 1,
      pageSize: 5,
      total: 10,
      ids:"",
      defaultProps: {
        children: "children",
        label: "sdtDeptName"
      },
      multipleSelection: [],
      multipleSelectionSon: [],
      roleId:"1",
      fqForm: [
        {
          fiAttr: {
            label: "登录名称"
          },
          el: "input",
          elAttr: {
            type: "text"
          },
          bindKey: "surLoginName"
        },
        {
          fiAttr: {
            label: "手机号码"
          },
          el: "input",
          elAttr: {
            type: "number"
          },
          bindKey: "surPhoneNumber"
        }
      ],
      filterVisible:true
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {
    query() {
      return this.doQuery.bind(this, getSelectByUser);
    },
    querySearch(){
      return this.doQuery.bind(this, getAllocatedList);
    }
  },
  created() {
    this.query();
    this.roleId = this.$route.query.roleId != null ? this.$route.query.roleId:this.roleId;
    this.queryList.roleId = this.roleId;
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
    handleSelectionChangeSon(val) {
      this.multipleSelectionSon = val;
    },
    //重置按钮
    reset() {
      this.form.roleName = "";
      this.form.roleKey = "";
    },
    exported() {
      //导出
      window.location.href =
        "http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel";
    },
    batchDelete() {
      //批量删除
      let selectArr = [];
      if (
        typeof this.multipleSelection == "undefined" ||
        this.multipleSelection.length == 0
      ) {
        this.$message({
          message: "请选择需要删除的数据！",
          type: "warning"
        });
      } else {
        this.multipleSelection.forEach((v, i) => {
          selectArr.push(v.surUserId);
        });
        this.deleted(selectArr.join(","));
      }
    },
    revise() {
      this.$router.push('/system/role')
    },
    deleted(ids) {
      //删除
      this.dialogVisible = true;
      this.ids = ids;
    },
    roleAdds(){ //添加用户
        this.dialogFormVisible = true;
        getUnallocatedList({roleId:this.roleId}).then(res=>{
          this.unTableDataList = res.rows;
        })
    },
    preservation(){ //保存
        let selectArr = [];
        this.multipleSelectionSon.forEach((v, i) => {
          selectArr.push(v.surUserId);
        });
        selectArr.join(",")
        let selectArrSon = selectArr.toString();
        getInsertUserRole({roleId:this.roleId,userIds:selectArrSon}).then(res=>{
          this.dialogFormVisible = false;
          this.$message({
              type: "success",
              message: "添加用户成功!"
          });
          this.query()
        })
    },
    sure(){ //删除
        if(this.ids.length >= 1){
            getDeleteUserRole({surUserIds:this.ids,surRoleId:this.roleId}).then(res=>{
                this.dialogVisible = false;
                this.$message({
                    type: "success",
                    message: "批量取消授权成功!"
                });
                this.query()
            })
        }else {
            deleteRoleGwPage({roleId:this.ids}).then(res=>{
                this.dialogVisible = false;
                this.$message({
                    type: "success",
                    message: "取消授权成功!"
                });
                this.query()   
            })
        }
        
    },

    unSearch(){
      getUnallocatedList({
        roleId:this.roleId,
        surLoginName:this.form.surLoginName,
        surPhoneNumber:this.form.surPhoneNumber,
      }).then(res=>{
        this.unTableDataList = res.rows;
      })
    }
  }
};
</script>