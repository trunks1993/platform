<template>
	<div class="user">
		<div class="tabs-search">
			<Search></Search>
		</div>
		<div class="dashboard-content">
			 <div class="organization"></div>
			 <div class="table">

			 </div>
		</div>
	</div>
</template>
<script>
import Search from '../layout/components/Search'
export default {
  name: 'main',
  data() {
    return {

    };
  },
  components: {
	  Search
  },
  methods: {

  }
};

</script>
<style lang="scss">
	.user {
		color: #fff;
		height: 100%;
		.tabs-search {
			height: 187px;
		}
		.dashboard-content {
			height: calc(100% - 187px);
			display: flex;
			.organization {
				width: 223px;
				height: 100%;
			}
			.table {
				width: calc(100% - 223px);
				height: 100%;
			}
		}
	}
</style>

