<template>
  <div class="main-container">
      <div class="header">
           <div class="height"></div>
           <v-head></v-head>
      </div>
      <div class="sidebar-appmain">
         <div class="son-sidebar-appmain">
           <div class="sidebar">
             <v-sidebar></v-sidebar>
           </div>
           <div class="appmain">
               <div class="appmain-top">
                    <v-Search></v-Search> 
               </div>
               <div class="appmain-bottom">
                    <v-AppMain></v-AppMain>
               </div>
           </div>
         </div>
      </div>
  </div>
</template>
<script>
import vHead from '@/views/layout/components/Head'
import vSidebar from '@/views/layout/components/Sidebar'
import vAppMain from '@/views/layout/components/AppMain'
import vSearch from '@/views/layout/components/Search'
export default {
	name: 'main',
	data() {
		return {
			
		};
	},
    components: {
		vHead,
        vSidebar,
        vAppMain,
        vSearch
	},
	methods: {
		
	}
};
</script>
<style lang="scss" scoped>
    .main-container {
       width: 100%;
	   height: 100%;
	   background: url(../../assets/login-Bg.png);
	   background-size: 100% 100%;
       .header {
           height:145px;
           width:100%;
           .height {
               height:10px;
           }
       }
       .sidebar-appmain {
           width:100%;
           height: calc(100vh - 185px);
           box-sizing: border-box;
           padding-left:52px;
           padding-right:52px;
           .son-sidebar-appmain {
               width:100%;
               height:100%;
               border-radius: 5px;
               padding:14px 19px;
               .sidebar {
                   width:259px;
                   height:100%;
                   float:left;
               }
               .appmain {
                   width:calc(100% - 279px);
                   height:100%;
                   float:right;
                   .appmain-top {
                       width:100%;
                       height:186px;
                   }
                   .appmain-bottom {
                       width:100%;
                       height:calc(100% - 186px);
                   }
               }
           }
       }
    }
</style>
