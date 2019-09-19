<template>
    <div class="post-container">
        <div class="tabs-search" v-if="isSearch">
            <FilterQueryForm
                :fAttr="{'label-width': '80px'}"
                :resetBtnVisible="false"
                :searchBtnVisible="true"
                :model="fqForm"
                @afterFilter="handleFilter($event, query)"
            ></FilterQueryForm>
		</div>
		<div class="dashboard-content">
			 <!-- <div class="organization"></div> -->
			 <div class="table">
                <!-- <div class="main-right"> -->
                    <div class="tableHead">
                        <el-button @click="addInfo"><i class="iconComm add"></i>新增</el-button>
                        <el-button @click="batchDelete"><i class="iconComm delete"></i>删除</el-button>
                        <el-button @click="revise"><i class="iconComm modify"></i>修改</el-button>
                        <!-- <el-button><i class="iconComm loading"></i>导入</el-button> -->
                        <el-button @click="handleExport(baseExpApi)"><i class="iconComm leading"></i>导出</el-button>
                        <div class="operation">
                            <div @click="toggle"><span></span></div>
                            <div @click="query"><span></span></div>
                            <div><span></span></div>
                            <div><span></span></div>
                        </div>
                    </div>
                    <div class="tabled">
                        <el-table border
                            ref="multipleTable"
                            :data="tableDataList"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                            type="selection">
                            </el-table-column>
                            <el-table-column prop="postId" label="岗位编号"> </el-table-column>
                            <el-table-column prop="postCode" label="岗位编码"></el-table-column>
                            <el-table-column prop="postName" label="岗位名称" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="postSort" label="显示顺序" show-overflow-tooltip></el-table-column>
                            <el-table-column label="状态" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span :class="[scope.row.status == '0'  ? 'normal' : 'stop']">{{scope.row.status == '0' ? '正常' : '停用'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span class="editor" @click="editor(scope.row)">编辑</span>
                                    <span class="editor" @click="deleted(scope.row.postId)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- <el-pagination style="text-align:right;margin-top:3.5%;"
                        background
                        layout="prev, pager, next"
                        :total="1000">
                    </el-pagination> -->
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
                <!-- </div> -->
			 </div>
		</div>

        <!-- 弹框 -->
        <el-dialog title="岗位管理基本信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="岗位名称" :label-width="formLabelWidth">
                    <el-input v-model="form.postName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="岗位编码" :label-width="formLabelWidth">
                    <el-input v-model="form.postCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序" :label-width="formLabelWidth">
                    <el-input v-model="form.postSort" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="岗位状态" :label-width="formLabelWidth" style="width: 325px;">
                    <el-switch
                        v-model="form.state">
                    </el-switch>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" class="inputTextarea">
                    <el-input v-model="form.remark" autocomplete="off" type="textarea" class="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">保 存</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
            </div>
		</el-dialog>
    </div>
</template>
<script>
import { queryGwPage,deleteGwPage,exportGwPage,editorGwPage,addGwPage } from '@/api';
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
    mixins: [mixin],
    data() {
        return {
            baseExpApi: 'http://192.168.0.105:9091/uumsApi/v1/manage/post/export',
            fqForm: [
                {
                fiAttr: {
                    label: "岗位编码"
                },
                el: "input",
                elAttr: {
                    type: "text"
                },
                bindKey: "postCode"
                },
                {
                fiAttr: {
                    label: "岗位名称"
                },
                el: "input",
                elAttr: {
                    type: "number"
                },
                bindKey: "postName"
                },
                {
                fiAttr: {
                    label: "岗位状态"
                },
                el: "select",
                elAttr: {},
                bindKey: "status",
                option: [{ label: "所有", value: '' },{ label: "正常", value: 0 }, { label: "停用", value: 1 }]
                }
                // {
                //   fiAttr: {
                //     label: "创建时间"
                //   },
                //   el: "date-picker",
                //   bindkey: "surStatus"
                // }
            ],
            dialogFormVisible: false,
            form: {},//新增修改页面的对象
            formLabelWidth: '120px',
            radio: '1',
            obj:{},
            isSearch:true,
        };

    },
    components: {
        FilterQueryForm
    },
    computed: {
        query() {
        return this.doQuery.bind(this, queryGwPage);
        }
    },
    created() {
        this.query();
    },
    methods: {
        toggle(){//显示隐藏查询切换
            this.isSearch = !this.isSearch;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        batchDelete(){//批量删除
            let selectArr = [];
            if(typeof(this.multipleSelection) == "undefined"){
                this.$message({
                    message: '请选择需要删除的数据！',
                    type: 'warning'
                });
            }else{
                this.multipleSelection.forEach((v,i) => {
                    selectArr.push(v.postId);
                })
                this.deleted(selectArr.join(','));
            }
        },
        addInfo(){//新增
            this.dialogFormVisible = true;
            this.form = {};
            this.obj = {};
        },
        editor(rows){//编辑
            this.dialogFormVisible = true;
            this.form = rows;
            this.obj = rows;console.log(this.form);
            let status = this.obj.status == '0' ?  true : false;
            this.$set(this.form,'state',status);//更新form中state的值
        },
        save(){//编辑入参
            if(JSON.stringify(this.obj) == '{}'){//新增
                this.addAsk();
            }else{//编辑
                this.saveAsk();
            }  
        },
        saveAsk(){//编辑保存
            this.form.status = this.form.state ?  '0': '1';//更新状态传给后端
            editorGwPage(this.form).then(res => {
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
                this.dialogFormVisible = false;
                this.query();
            });
        },
        addAsk(){//新增保存
            this.form.status = this.form.state ?  '0': '1';
            addGwPage(this.form).then(res => {
                this.$message({
                    message: '新增成功！',
                    type: 'success'
                });
                this.dialogFormVisible = false;
                this.query();
            });
        },
        handleSelectionChange(val) {//多选
            this.multipleSelection = val;
        },
        revise(){//批量修改
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
                deleteGwPage({str:ids}).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.query();
                });  
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
};
</script>
