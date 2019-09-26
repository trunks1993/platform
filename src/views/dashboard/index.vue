<template>
	<div class="common-container">
		<div class="text-wrapper">
			<h1>系统简介 Introduction</h1>
			<p class="text">{{text}}</p>
		</div>
		<div class="text-wrapper">
			<h1>技术支持 Technical support</h1>
			<div class="text-list">
				<li v-for="(item,index) in textLise" :key="index">{{item.text}}</li>
			</div>
		</div>
		<div class="text-wrapper">
			<h1>联系方式 Contact information</h1>
			<p v-for="(item,index) in dataList" :key="index">{{item.text}}</p>
		</div>
		<img src="../../assets/images/dashboard-bg.png" alt="">
	</div>
</template>
<script>
export default {
	data() {
		return {
			textLise:[
				{text:"技术选型："},
				{text:"核心框架：Spring Boot。"},
				{text:"安全框架：Apache Shiro。"},
				{text:"模板引擎：Thymeleaf。"},
				{text:"持久层框架：MyBatis。"},
				{text:"定时任务:Quartz。"},
				{text:"数据库连接池：Druid。"},
				{text:"工具类：Fastjson。"},
				{text:"更多……"},
			],
			dataList:[
				{text:"公司：上海瀚正信息科技股份有限公司"},
				{text:"联系电话：0731-84552168"},
				{text:"网址：http://www.hz-tech.net"},
			],
			text:"一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了若依管理 系统。她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统 。所有前端后台代码封装过后十分精简易上手，出错概率低。同时支持移动客户端访问。系统会陆续更新一些实用功能。",
		};
	},
}
</script>
<style lang="scss" scoped>
	.common-container {
		padding: 40px 55px;
		background: url(../../assets/images/table-content-bg.png);
		background-size: 100% 100%;
		position: relative;
		.text-wrapper {
			letter-spacing: 1px;
			margin-bottom: 45px;
			font-size: 15px;
			font-family:Adobe Heiti Std;
			p {
			   margin: 0;
			   line-height: 32px;
			}
			h1 {
				color: #4BAEFD;
				font-size:24px;
				line-height: 25px;
				font-weight:normal;
			}
			.text {
				width: 1080px;
			}
			.text-list {
				width: 629px;
				height: 136px;
				li {
					list-style: none;
					width: 50%;
					height: 27px;
					float: left;
				}
			}
		}
		img {
			position: absolute;
			right: 75px;
			top: 200px;
		}
	}
</style>