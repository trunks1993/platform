<template>
	<div>
        <div class="tabs" v-if="showTags">
            <ul>
                <li
                    v-for="(item, index) in tagsList"
                    :class="{ active: isActive(item.path) }"
                    :key="index"
                >
                    <router-link :to="item.path" class="tags-li-title">{{ item.title }}</router-link>
                    <div class="down" @click="closeTags(index)"></div>
                    <!-- v-if='index != 0' -->
                </li>
            </ul>
        </div>
        <!-- <div class="search">
            <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
                <el-form-item label="登录名称">
                    <el-input v-model="sizeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="sizeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-select v-model="sizeForm.region" placeholder="全部">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-col :span="11">
                    <el-date-picker type="date" placeholder="开始时间" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                    <el-date-picker type="date" placeholder="结束时间" v-model="sizeForm.date2" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div> -->
    </div>
</template>

<script>
import bus from '@/views/layout/components/bus.js';
export default {
	data() {
		return {
			tagsList: [
                {title:'系统管理',path:"/A"},
                {title:'用户管理',path:"/A"},
                {title:'日志管理',path:"/B"},
                {title:'状态管理',path:"/C"}
            ],
            sizeForm: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
		};
	},
	methods: {
		//判断当前标签
		isActive(path) {
			return path === this.$route.fullPath;
		},
		//设置标签
		setTags(route) {
			if(route.matched.length > 2){
				return false;
			}
			const isExist = this.tagsList.some(item => {
				return item.path === route.fullPath;
			});
			if (!isExist) {
				if (this.tagsList.length >= 10) {
					this.tagsList.shift();
				}
				// this.tagsList.push({
				// 	title: route.meta.title,
				// 	path: route.fullPath
                // })
                this.tagsList.push({
					title: '管理系统',
					path: '/home'
				})
				bus.$emit('tabs', this.tagsList);
			}
		},
		// 关闭单个标签
		closeTags(index) {
			const delItem = this.tagsList.splice(index, 1)[0];
			const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
			if (item) {
				delItem.path === this.$route.fullPath && this.$router.push(item.path);
			} else {
				this.$router.push('/home');
			}
        },
         onSubmit() {
            console.log('submit!');
        }
	},
	computed: {
		showTags() {
			return this.tagsList.length > 0;
		}
	},
	watch: {
		$route(newValue, oldValue) {
			this.setTags(newValue);
		}
	},
	created(){
	    this.setTags(this.$route);
	    // 监听关闭当前页面的标签页
	    bus.$on('close_current_tags', () => {
	        for (let i = 0, len = this.tagsList.length; i < len; i++) {
	            const item = this.tagsList[i];
	            if(item.path === this.$route.fullPath){
	                if(i < len - 1){
	                    this.$router.push(this.tagsList[i+1].path);
	                }else if(i > 0){
	                    this.$router.push(this.tagsList[i-1].path);
	                }else{
	                    this.$router.push('/');
	                }
	                this.tagsList.splice(i, 1);
	            }
	        }
	    })
	}
};
</script>

<style lang="scss">
.tabs {
	height: 26px;
	overflow: hidden;
	width: 100%;
	ul {
		list-style: none;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		margin: 0;
        padding-left:0;
		li {
			float: left;
			line-height: 26px;
			font-size: 14px;
            position: relative;
			text-align: center;
			box-sizing: border-box;
            width: 127px;
            height: 26px;
            background: url(../../../assets/searchBar.png)no-repeat;
            background-size: 100% 100%;
            margin-right: 12px;
			.tags-li-title{
				display: block;
				padding: 0 16px;
				color: #fff;
				text-decoration:none;
			}
			&.active {
                background: url(../../../assets/searchBar-active.png)no-repeat;
                background-size: 100% 100%;
			}
			&:hover {
				cursor: pointer;
				background: url(../../../assets/searchBar-active.png)no-repeat;
                background-size: 100% 100%;
			}
			.down {
				position: absolute;
				width: 12px;
				height: 12px; 
				top: 7px;
				right: 10px;
				background: url(../../../assets/closetab.png) center center no-repeat;
			}
		}
	}
}
.search {
    width: 100%;
    height: 150px;
    padding: 28px 20px;
}
</style>
<style>
    .el-form-item {
        width: 325px;
        color: #fff;
        float: left;
        margin-right: 112px;
        height: 60px;
    }
    .el-form-item:nth-child(4) {
        width:325px;
    }
    .el-form-item:nth-child(4) .el-form-item__content div:nth-child(1) {
        width: 45%;
        float: left;
    }
    .el-form-item:nth-child(4) .el-form-item__content div:nth-child(2) { 
        width: 10%;
        float: left;
        text-align: center;
    }
    .el-form-item:nth-child(4) .el-form-item__content div:nth-child(3) {
        width: 45%;
        float: left;
    }
    .el-form-item__label {
        float: left;
        font-size: 14px;
        line-height: 26px !important;
        color: #FFF;
    }
    .el-form-item--large {
        width: 660px;
    }
    .el-button {
        margin-left: 514px;
        width: 120px;
        height: 35px;
        background: url(../../../assets/buttonbg.png);
        background-size: 100% 100%;
        border:none;
        color: #fff;
    }
    .el-input__inner {
        background-color: #05254B !important; 
        border: 1px solid #02439D !important;
    }
    .el-picker-panel {
        color: #606266;
        border: 1px solid #02439D;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        background: #05254B;
        border-radius: 4px;
        line-height: 30px;
        margin: 5px 0;
    }
    .el-picker-panel__footer {
        border-top: 1px solid #e4e4e4;
        padding: 4px;
        text-align: right;
        background-color: #fff;
        position: relative;
        font-size: 0;
    }
    .el-popper[x-placement^=top] .popper__arrow {
        bottom: -6px;
        left: 50%;
        margin-right: 3px;
        border-top-color: #ebeef5;
        border-bottom-width: 0;
    }
    .el-date-picker__header {
        margin: 12px;
        text-align: center;
    }
    .el-date-picker .el-picker-panel__content {
        width: 292px;
    }
    .el-picker-panel__content {
        position: relative;
        margin: 15px;
    }
    .el-date-picker table {
        table-layout: fixed;
        width: 100%;
    }
    .el-date-table {
        font-size: 12px;
        user-select: none;
    }
    .el-year-table {
        font-size: 12px;
        margin: -1px;
        border-collapse: collapse;
    }
    .el-month-table {
        font-size: 12px;
        margin: -1px;
        border-collapse: collapse;
    }
    .el-date-table td {
        width: 32px;
        height: 30px;
        padding: 4px 0;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        position: relative;
    }
    .el-date-table td.next-month, .el-date-table td.prev-month {
        color: #c0c4cc;
    }
    .el-date-table td div {
        height: 30px;
        padding: 3px 0;
        box-sizing: border-box;
    }
    .el-date-table td span {
        width: 24px;
        height: 24px;
        display: block;
        margin: 0 auto;
        line-height: 24px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
    }
    .el-date-table td.today span {
        color: #fff;
        font-weight: 700;
    }
    .el-date-table td.available:hover {
        color: #409eff;
    }
    .el-date-table td.next-month, .el-date-table td.prev-month {
        color: #DBDCE3;
    }
    .el-date-picker__header-label,
    .el-date-table th,
    .el-date-table td,
    .el-icon-arrow-right:before,
    .el-icon-d-arrow-right:before, 
    .el-icon-d-arrow-left:before,
    .el-icon-arrow-left:before {
        color: #4BAEFD;
    }
</style>
