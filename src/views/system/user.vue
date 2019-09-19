<template>
  <div class="common-container">
    <FilterQueryForm
      :fAttr="{'label-width': '80px'}"
      :resetBtnVisible="false"
      :searchBtnVisible="true"
      :model="fqForm"
      @afterFilter="handleFilter($event, getSysUserList)"
    ></FilterQueryForm>

    <div class="app-wrapper" style="display: flex;">
      <div class="org-box">
        <!-- <div class="zzBox">
          <span>组织结构</span>
          <div class="revise">
            <i class="comm revised"></i>
            <i class="comm refresh"></i>
            <i class="comm select"></i>
          </div>
        </div> -->
        <div class="org-box-header">
          <label style="font-size: 14px;">组织机构</label>
        </div>
        
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>

      <div class="content-box">
        <div class="content-box-tool">
          <el-button type="tool" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
          <el-button type="tool" icon="el-icon-close">删除</el-button>
          <el-button type="tool" icon="el-icon-editor">修改</el-button>
          <el-button type="tool" icon="el-icon-import">导入</el-button>
          <el-button type="tool" icon="el-icon-export">导出</el-button>
        </div>
        <div class="content-box-table">
          <el-table :data="tableDataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户ID" prop="surUserId" width="120"></el-table-column>
            <el-table-column prop="surLoginName" label="登录名称" width="120"></el-table-column>
            <el-table-column prop="surUserName" label="用户名称"></el-table-column>
            <el-table-column prop="surDeptId" label="部门"></el-table-column>
            <el-table-column prop="surPhoneNumber" label="手机"></el-table-column>
            <el-table-column label="用户状态" width="120">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.surStatus"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="surCreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="text" @click="handleClick(scope.row)">查看</el-button>
                <el-button type="text">编辑</el-button>
                <el-button type="text-warn">重置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content-box-pagination">
          <el-pagination
            style="text-align:right;"
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
        <img src="../../assets/images/icon-title-left.png" alt="">
        <span class="title">基本信息</span>
        <img src="../../assets/images/icon-title-right.png" alt="">
      </div>
      <el-form :model="form" :inline="true">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="归属部门" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录帐号" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">男</el-radio>
          <el-radio v-model="radio" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-switch v-model="value1"></el-switch>
        </el-form-item>
        <el-form-item label="岗 位" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择岗位">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗 位" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">操作员</el-radio>
          <el-radio v-model="radio" label="2">管理员</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSysUserList, getSysDeptTreeData } from "@/api";
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
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
        },
        {
          fiAttr: {
            label: "用户状态"
          },
          el: "select",
          elAttr: {},
          bindKey: "surStatus",
          option: [{ label: "正常", value: 0 }, { label: "禁用", value: 1 }]
        }
        // {
        //   fiAttr: {
        //     label: "创建时间"
        //   },
        //   el: "date-picker",
        //   bindkey: "surStatus"
        // }
      ],
      tableData: [],
      value1: true,
      multipleSelection: [],
      radio: "1",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      data: [],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      defaultProps: {
        children: "children",
        label: "sdtDeptName"
      }
    };
  },
  components: {
    FilterQueryForm
  },
  computed: {
    query() {
      return this.doQuery.bind(this, getSysUserList);
    }
  },
  created() {
    this.query();
    getSysDeptTreeData().then(res => {
      this.data = res;
    });
  },
  methods: {
    handleClick(row) {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleNodeClick(data) {}
  }
};
</script>
<style lang="scss" scoped>
.org-box {
  width: 223px;
  background: url(../../assets/images/org-bg.png);
  background-size: 100% 100%;
  padding: 20px;
  &-header {
    padding: 5px 0;
    margin-bottom: 20px;
    position: relative;
  }
}

.content-box {
  width: calc(100% - 238px);
  margin-left: 15px;
}

</style>