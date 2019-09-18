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
        <el-dialog title="基本信息" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="height:308px;">
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
            baseExpApi: 'http://192.168.0.105:9091/uumsApi/v1/manage/post/exportExcel',
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
            this.obj = rows;
        },
        save(){//编辑入参
            if(JSON.stringify(this.obj) == '{}'){//新增
                this.addAsk();
            }else{//编辑
                this.saveAsk();
            }  
        },
        saveAsk(){//编辑保存
            this.form.status = this.form.state ?  '0': '1';
            editorGwPage(this.form).then(res => {
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
                this.dialogFormVisible = false;
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
                this.queryDate();
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
                    this.queryDate();
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
<style lang="scss" scoped>
.post-container {
    color: #fff;
    height: 100%;
    .tabs-search {
        height: 187px;
    }
    .dashboard-content {
        height: calc(100% - 187px);
        width:100%;
        display: flex;
        .table {
            width: 100%;
            height: 100%;
            background:url(../../assets/mainTreeR.png)no-repeat;
            background-size: 100% 100%;
            padding: 0 1.5% 1.5% 1.5%;
            .el-button{
                width: 90px;
                height: 36px;
                background:#05254B;
                border-radius:4px;
                outline: none;
                border: none;
                font-size: 14px;
                color:#fff;
                margin-right: 10px;
                margin-left:0;
                .iconComm{
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    margin-right: 6px;
                    background:url(../../assets/icon.png);
                }
                .add{
                    background-position: -57px 792px;
                }
                .delete{
                    background-position: -57px 770px;
                }
                .modify{
                    background-position: -57px 749px;
                }
                .loading{
                    background-position: -57px 726px;
                }
                .leading{
                    background-position: -57px 704px;
                }
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
            .tabled{
                margin: 10px 0;
            }
            
        }
    }
    .normal{
        color: #45EBA7 !important;
    }
    .stop{
        color:#CB3203 !important;
    }
}
.post-container /deep/.el-dialog {
    .el-dialog__header {
        text-align: center;
    .el-dialog__title {
        text-align: center;
        color: #4BAEFD;
    }
    .el-dialog__title:before {
        content:'';
        display: inline-block;
        background-image: url(../../assets/login-left.png);
        background-size: 100% 100%;
        width:91px;
        height: 13px;
        margin-right: 12px; 
    }
    .el-dialog__title:after {
        content:'';
        display: inline-block;
        background-image: url(../../assets/login-right.png);
        background-size: 100% 100%;
        width:91px;
        height: 13px;
        margin-left: 12px; 
    }
    .el-dialog__headerbtn {
        top: 80px;
        right: 80px;
        .el-dialog__close {
            color: #FFF;
            font-size: 30px;
        }
    }
    }
    .el-dialog__body {
        padding:10px 20px;
        .el-form {
            padding:  20px 0px 0px;
            .el-radio {
                color: #FFF;
                margin-right: 50px; 
            }
        }
    }
}
.el-dialog__body::before {
    content: '基本信息'; 
    width: 100%;
    height: 34px;
    display: inline-block;
    border-bottom: 1px dashed rgba(75,174,253,1); 
    color: #63ACDF;
    font-size: 13px;
}
.dialog-footer {
    text-align: center;
    margin-top: 4%;
}
.el-dialog__footer::before {
    border-bottom: none !important; 
}
.textarea {
    width: 100%;
    background:rgba(5,37,75,1);
}
.post-container /deep/.el-textarea__inner{
    background: #05254B;
    border: 1px solid #02439D; 
    border-radius:2px;
}
.post-container /deep/.inputTextarea{
    width: 100%;
    padding-right:150px;
}
.post-container /deep/.cell span.editor {
    padding: 10px;
    cursor: pointer;
}
.post-container /deep/.cell span:nth-child(1) {
    color: #45EBA7;
}
.post-container /deep/.cell span:nth-child(2) {
    color: #CB3203;
}
.post-container /deep/.cell span:nth-child(3) {
    color: #E6BF06;
}
.post-container /deep/.el-form-item__content,.el-button{
    margin-left: 0 ;
}
.post-container /deep/.el-form-item:nth-child(4){
    width:0;
}
.post-container /deep/ .el-message-box__btns button:nth-child(2){
    background: transparent !important;
}
// .post-container /deep/ .el-button--primary {
//     background: url(../../assets/buttonbg.png) !important;
// }
.el-message-box__btns .el-button--primary:focus, .el-button--primary:hover{
    background: #022960;
}
.post-container /deep/ .el-pagination .el-input__inner{
    background: none !important;
    border: none !important;
}
.post-container /deep/.el-pagination span:not([class*=suffix]), .el-pagination button{
    margin-left: 10px;
    margin-right: 0;
}
</style>
<style>
.el-button--default{
    background: #022960;
}
.el-message-box{
    background: #05254B !important;
    border: none;
}
.el-message-box__title,.el-message-box__message p{
    color:#fff;
}
.el-message-box__btns .el-button{
    margin-left: 0;
    background:#022960 !important;
}
.el-message-box__btns .el-button--primary:focus, .el-button--primary:hover{
    background: #022960;
}
.el-message-box__btns .el-button--primary:focus,.el-button--default:hover{
    background: #022960;
    color: #fff;
}
.el-pagination button:disabled,.el-dialog, .el-pager li,.el-pagination button:hover,.el-pagination .btn-prev, .el-pagination .btn-next{
    background:#022960 !important;
}
</style>
