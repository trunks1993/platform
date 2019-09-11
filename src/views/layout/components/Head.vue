<template>
  <div class="head-container">
        <div class="head-date">
             <p>欢迎来到统一管理平台 {{currDate}} {{currTime}}</p>
        </div>
        <div class="head-title">
             <h1>统一管理平台登录界面</h1>
        </div>
        <div class="head-information">
            <div>
              <img src="../../../assets/head-return.png" /> <span>返回</span>
            </div>
            <div>
                <img src="../../../assets/head-sheji.png" /> <span>设置</span>
            </div>
            <div>
                <img src="../../../assets/head-people.png" /> <span>用户01</span>
                <img src="../../../assets/head-drop-down.png" />
            </div>
        </div>
  </div>
</template>
<script>
// import { getSidebar } from '@/api/app'
export default {
	name: 'head',
	data() {
		return {
			 options: [{
            value: '选项1',
            label: '部门管理'
            }, {
            value: '选项2',
            label: '用户管理',
            disabled: true
            }, {
            value: '选项3',
            label: '平台管理'
            }, {
            value: '选项4',
            label: '功能管理'
            }, {
            value: '选项5',
            label: '数据字典'
            }],
            value: '',
            currDate:'',
            currTime:'',
            day:'',
            data:{},
		};
	},
    mounted() {
        this.getUserInfo();
		this.getTime();
        let _this = this; 
        this.timer = setInterval(() => {
            _this.getTime();
        }, 1000)
    },
	methods: {
		getTime(){//获取当前时间
            let time = new Date();
            let year = time.getFullYear();
            let month = time.getMonth()+1;
            month = month < 10 ? '0' + month : month;
            let dates = time.getDate();
            dates = dates < 10 ? '0' + dates : dates;
            let hour = time.getHours();
            hour  = hour < 10 ? '0' + hour : hour;
            let minute = time.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            this.currDate = year + '-' + month + '-' + dates;
            this.currTime = hour + ':' + minute;
            this.day = time.getDay();
        },
        getUserInfo(){
            console.log(44)
            let token = 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..lbb_Xg7dXgdd8wrb.PMTxiwGcU76pGD7QPaENp-UM7QWl-PzlIhPISFPKlydP3ePkS3ckpruHNMTcfgurUj6bpi8oYA85tuWXzZP9NVCWhwz1kYamoklNlwPfPvBUuIyIZfuyUq_lwKY99ybZMiipxkFt9-DPjz5EfFTsaUr_Q73DZf2Q6mqSh-rauwg2btlU3TbixLctL6QX7kgwddfOv3SWkD9oPj8ve_4OB6YDUJIwImNdBUEIHSkFrFSVDje2APe7UAlLNMxU4pcJbmQs6g-7ez-gBKpAhG0KOMZAl7jL3quKyzI_LZDSxIbKJJH_7e9VetEcZ_XpDJsshsZNqvR4Tl0oRtidtbM9Y1g57HQUnQ0kQq__1TkzcAyDswWyxVH16nCVfnPXCmyl.ZeD0qf_n-4FZCX2_u_ZBQw';
            let userId = 1; 
        }
	},
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
};
</script>
<style lang="scss" scoped>
    .head-container {
        height: 118px;
        background: url(../../../assets/header-Bg.png);
        background-size: 100% 100%;
        color: #fff;
        position: relative;
        .head-date {
            line-height:50px;
            display:inline-block;
            margin-left:40px;
            p {
                margin:0;
                display: inline-block;
                line-height:50px;
            }
        }
        .head-title {
            display:inline-block;
            margin:0 auto;
            width:416px;
            position:absolute;
            left:50%;
            margin-left:-218px;
            text-align:center;
            letter-spacing: 2px;
            font-family:FZZhengHeiS-DB-GB;
            font-weight:400;
        }
        
        .head-information {
            float:right;
            line-height:50px;
            margin-right:40px;
            div {
                width:80px;
                height:50px;
                display:inline-block;
                margin-right:18px;
                cursor: pointer;
                img {
                    vertical-align: middle;
                    margin-right:8px;
                }
            }
            div:nth-child(3) {
                width:120px;
                margin-right:0;
                span {
                    margin-right:8px;
                }
            }
        }
    }
</style>
