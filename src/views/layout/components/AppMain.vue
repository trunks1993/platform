<template>
  <section class="app-main" id="app-main">
    <transition name="fade" mode="out-in">
      <!-- <keep-alive :include="cachedViews"> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </section>
</template>
<script>
export default {
	data() {
		return {};
	},
    mounted() {
      
    },
	methods: {
        
	},
    
};
</script>
<style lang="scss" scoped>
    .app-main {
        width: 100%;
        height: calc(100% - 26px);
        margin-left: 15px;
    }
</style>
