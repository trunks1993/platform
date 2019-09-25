<template>
  <div class="common-container">
     <el-form :model="allocatedListForm" :inline="true" style="height: 159px;background: url(../img/tabs-search-bg.e34485a0.png);background-size: 100% 100%;padding: 20px;">
      <el-form-item label="登录名称" :label-width="'120px'">
        <el-input v-model="allocatedListForm.surLoginName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" :label-width="'120px'">
        <el-input v-model="allocatedListForm.surPhoneNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="allocatedListSearch">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="app-wrapper">
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
            <el-table-column label="用户状态" prop="surStatus"></el-table-column>
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
      allocatedListForm: {
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
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {},
  created() {
    this.roleId = this.$route.query.roleId != null ? this.roleId:1;
    this.query();
    getMenuList(this.sizeForm).then(res => {
      console.log(res);
      this.data = res;
    });
  },
  methods: {
    query() {
      getSelectByUser({ roleId: this.roleId }).then(res => {
        console.log(res);
        this.tableDataList = res.rows;
      });
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
      console.log(this.multipleSelection);
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
        console.log(ids)
      //删除
      this.dialogVisible = true;
      this.ids = ids;
    },
    roleAdds(){ //添加用户
        this.dialogFormVisible = true;
        getUnallocatedList({surRoleId:this.roleId}).then(res=>{
          console.log(res)
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
        console.log(this.ids);
        if(this.ids.length >= 1){
            getDeleteUserRole({surUserIds:this.ids,surRoleId:1}).then(res=>{
                this.dialogVisible = false;
                this.$message({
                    type: "success",
                    message: "批量取消授权成功!"
                });
            })
        }else {
            deleteRoleGwPage({roleId:this.ids}).then(res=>{
                console.log(res)
                this.dialogVisible = false;
                this.$message({
                    type: "success",
                    message: "取消授权成功!"
                });
            })
        }
        this.query()
    },
    allocatedListSearch(){
      this.allocatedListForm.surRoleId = this.roleId;
      getAllocatedList(this.allocatedListForm).then(res=>{
        this.tableDataList = res.rows;
      })
    },
    unSearch(){
      getUnallocatedList({
        surRoleId:this.roleId,
        surLoginName:this.form.surLoginName,
        surPhoneNumber:this.form.surPhoneNumber,
      }).then(res=>{
        this.unTableDataList = res.rows;
      })
    }
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
    background: url(../../assets/images/tabs-search-bg.png);
    background-size: 100% 100%;
    .search {
      width: 100%;
      height: 150px;
      padding: 28px 20px;
    }
  }
  .dashboard-content {
    height: calc(100% - 187px);
    width: 100%;
    display: flex;
    .organization {
      width: 223px;
      height: 100%;
    }
    .table-content {
      width: 100%;
      height: 100%;
      background: url(../../assets/images/table-content-bg.png);
      background-size: 100% 100%;
      padding: 22px 34px;
      box-sizing: border-box;
      .tableHead {
        height: 70px;
        .button {
          width: 90px;
          height: 36px;
          line-height: 36px;
          background: #05254b;
          margin-right: 20px;
          float: left;
          border-radius: 4px;
          text-align: right;
          padding-right: 20px;
          cursor: pointer;
        }
        .button::before {
          content: "";
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
          background: #05254b;
          border: 1px solid #02439d;
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
            content: "";
            width: 1px;
            height: 28px;
            display: inline-block;
            background: linear-gradient(
              0deg,
              rgba(1, 84, 199, 0) 0%,
              rgba(1, 84, 199, 1) 42%,
              rgba(1, 84, 199, 0) 100%
            );
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
        overflow: auto;
      }
    }
  }
}
