<template>
  <div class="postManage-container">
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
           </div>
         </div>
      </div>
  </div>
</template>
<script>
import vHead from '@/views/layout/components/Head'
import vSidebar from '@/views/layout/components/Sidebar'
export default {
	name: 'main',
	data() {
		return {
			
		};
	},
    components: {
		vHead,
        vSidebar,
        // vAppMain,
	},
	methods: {
		
	}
};
</script>
<style lang="scss" scoped>
</style>