<template>
    <div class="dict-container">
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
                        <el-button @click="addInfo()"><i class="iconComm add"></i>新增</el-button>
                        <el-button @click="batchDelete()"><i class="iconComm delete"></i>删除</el-button>
                        <el-button @click="revise()"><i class="iconComm modify"></i>修改</el-button>
                        <!-- <el-button><i class="iconComm loading"></i>导入</el-button> -->
                        <el-button @click="handleExport(baseExpApi)"><i class="iconComm leading"></i>导出</el-button>
                        <div class="operation">
                            <div @click="toggle()"><span></span></div>
                            <div @click="query()"><span></span></div>
                            <div><span></span></div>
                            <div><span></span></div>
                        </div>
                    </div>
                    <div class="tabled">
                        <el-table border ref="multipleTable" :data="tableDataList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection"></el-table-column>
                             <el-table-column prop="dictId" label="字典主键"></el-table-column>
                            <el-table-column prop="dictName" label="字典名称"></el-table-column>
                            <el-table-column prop="" label="字典类型" show-overflow-tooltip>
                                 <template slot-scope="scope">
									<span class="type">{{ scope.row.dictType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span :class="[scope.row.status == '0'  ? 'normal' : 'stop']">{{scope.row.status == '0' ? '正常' : '停用'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span class="editor" @click="editor(scope.row)">编辑</span>
									<span class="editor" @click="deleted(scope.row.dictId)">删除</span>
                                    <span class="editor">列表</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
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
                <el-form-item label="字典名称" :label-width="formLabelWidth">
                    <el-input v-model="form.dictName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="字典类型" :label-width="formLabelWidth">
                    <el-input v-model="form.dictType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" style="width: 325px;">
                    <el-switch
                        v-model="form.state">
                    </el-switch>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" class="inputTextarea">
                    <el-input v-model="form.remark" autocomplete="off" type="textarea" class="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save()">保 存</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
            </div>
		</el-dialog>
    </div>
</template>
<script>
import { queryDictPage, deleteDictPage, editorDictPage, addDictPage } from '@/api';
import FilterQueryForm from "@/components/FilterQueryForm";
import { mixin } from "@/mixins";
export default {
    mixins: [mixin],
    data() {
        return {
            baseExpApi:'http://192.168.0.105:9091/uumsApi/v1/dictionaries/dictType/exportExcel',
            fqForm: [
                {
                fiAttr: {
                    label: "字典名称"
                },
                el: "input",
                elAttr: {
                    type: "text"
                },
                bindKey: "dictName"
                },
                {
                fiAttr: {
                    label: "字典类型"
                },
                el: "input",
                elAttr: {
                    type: "number"
                },
                bindKey: "dictType"
                },
                {
                fiAttr: {
                    label: "字典状态"
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
            value: true,
            form:{},
            isSearch:true,
            dialogFormVisible: false,
            obj:{},
            formLabelWidth: '120px',
        };
    },
    components: {
        FilterQueryForm
    },
    created() {
        this.query();
    },
    computed: {
        query() {
            return this.doQuery.bind(this, queryDictPage);
        }
    },
    methods: {
        toggle(){//显示隐藏查询切换
            this.isSearch = !this.isSearch;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        change (data) {
            console.log(data)
        },
        // exported(){//导出
        //     window.location.href = 'http://192.168.0.105:9091/uumsApi/v1/dictionaries/dictType/exportExcel?dictName='+this.sizeForm.name+'&dictType='+this.sizeForm.type+'&status='+this.sizeForm.status;
        // },
        batchDelete(){//批量删除
            let selectArr = [];
            if(typeof(this.multipleSelection) == "undefined"){
                this.$message({
                    message: '请选择需要删除的数据！',
                    type: 'warning'
                });
            }else{
                this.multipleSelection.forEach((v,i) => {
                    selectArr.push(v.dictId);
                })
                this.deleted(selectArr.join(','));
            }
        },
        deleted(ids){//删除
            this.$confirm('确认删除该数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteDictPage({str:ids}).then(res => {
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
            editorDictPage(this.form).then(res => {
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
                this.dialogFormVisible = false;
            });
        },
        addAsk(){//新增保存
            this.form.status = this.form.state ?  '0': '1';
            addDictPage(this.form).then(res => {
                this.$message({
                    message: '新增成功！',
                    type: 'success'
                });
                this.dialogFormVisible = false;
                this.query();
            });
        },
    }
};
</script>
<style lang="scss" scoped>
.dict-container {
    color: #fff;
    height: 100%;
    .tabs-search {
        height: 187px;
        .query{
            margin: 0 !important;
            width: 0 !important;
        }
    }
    .dashboard-content {
        height: calc(100% - 187px);
        display: flex;
        .table {
            width: 100%;
            height: 100%;
            background:url(../../assets/mainTreeR.png)no-repeat;
            background-size: 100% 100%;
            padding: 1.5%;
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
.dict-container /deep/.el-dialog {
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
.dict-container /deep/.el-textarea__inner{
    background: #05254B;
    border: 1px solid #02439D; 
    border-radius:2px;
}
.dict-container /deep/.inputTextarea{
    width: 650px;
    padding-right:150px;
}
.dict-container /deep/ .el-switch {
    display: inline-flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 24px;
    height: 24px;
    vertical-align: middle;
}
.dict-container /deep/.el-switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
}
.dict-container /deep/.el-switch.is-checked .el-switch__core {
    border-color: #4BAEFD;
    background-color: #4BAEFD;
}
.dict-container /deep/.el-switch.is-disabled .el-switch__core, .el-switch.is-disabled .el-switch__label {
    cursor: not-allowed;
}
.dict-container /deep/.el-switch__core {
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
.dict-container /deep/.el-switch.is-checked .el-switch__core:after {
    left: 88%;
    margin-left: -17px;
}
.dict-container /deep/.el-switch__core:after {
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
.dict-container /deep/.cell span.type{
    color:#4baefd !important;
}
.dict-container /deep/.cell span.editor {
    padding: 10px;
    cursor: pointer;
}
.dict-container /deep/.cell span:nth-child(1) {
    color: #45EBA7;
}
.dict-container /deep/.cell span:nth-child(2) {
    color: #CB3203;
}
.dict-container /deep/.cell span:nth-child(3) {
    color: #E6BF06;
}
.dict-container /deep/ .el-pagination .el-input__inner{
    background: none !important;
    border: none !important;
}
</style>
