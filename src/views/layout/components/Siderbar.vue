<template>
  <div class="side-bar">
       
  </div>
</template>
<script>
export default {
    watch: {
      
    },
	data() {
      return {
      };
	},
    mounted() {

    },
	computed: {
		
	},
	methods: {
	}
    
};
</script>
<style lang="scss" scoped>
    .side-bar {
        width: 269px;
        height: 100%;
        background: url(../../../assets/sideBar-bgTwo.png);
        background-size: 100% 100%;
        padding:50px 30px;
        box-sizing: border-box;
    }
</style>
<style>

  .sideBar-container > .el-tree { 
      color:#fff;
  }
  .sideBar-container > .el-tree > .el-tree-node{
      background: url(../../../assets/sideBar-titleBg.png);
      background-size: 100% 100%;
      margin-bottom:18px;
      width:100%;
      min-height: 44px;
      box-sizing: border-box;
      text-align:center;
      outline:none;
  }
  .el-tree-node__content {
      cursor: pointer;
      outline:none;
  }
  .sideBar-container > .el-tree > .el-tree-node > .el-tree-node__content:nth-child(1) {
      border-bottom: 1px solid rgba(0,214,253,0.6);
      width: 80%;
      height:43px;
      line-height:43px;
      margin-left: 10%;
  }
  .el-tree-node__children {
      font-size:14px;
  }
  .el-tree-node {
      outline:none;
  }
  .sideBar-container > .el-tree > .is-expanded {
      background: url(../../../assets/sideBar-titleBg1.png) !important;
      background-size: 100% 100% !important;
      outline:none;
  }
    .sideBar-container .el-tree .el-tree-node .el-tree-node__content .el-tree-node__label {
      height:36px;
      line-height:36px;
  }
</style>
