<template>
  <div class="sideBar-container">
        <el-tree
        class="filter-tree"
        :data="data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
        </el-tree>
  </div>
</template>
<script>
export default {
	name: 'head',
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
	data() {
      return {
        filterText: '',
        sidebarImageA:require('../../../assets/sideBar-titleBg.png'),
        sidebarImageB:require('../../../assets/sideBar-titleBg1.png'),
        data: [{
          id: 1,
          label: '系统管理',
          children: [{
            id: 4,
            label: '用户管理',
          },{
            id: 11,
            label: '日志管理',
            children: [{
              id: 9,
              label: '操作日志',
              children: [{
                id: 9,
                label: '编辑日志'
                }, {
                id: 10,
                label: '查看日志'
              }]
            }, {
              id: 10,
              label: '操作日志'
            }]
          },{
            id: 12,
            label: '日志管理',
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
	},
    mounted() {
       console.log(this.$refs.tree.$el.children)
    },
	computed: {
		onRoutes() {
			return this.$route.path.replace('/', '');
		}
	},
	methods: {
		filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
	}
    
};
</script>
<style lang="scss" scoped>
    .sideBar-container {
        width: 100%;
        height: 100%;
        background: url(../../../assets/sideBar-bgTwo.png);
        background-size: 100% 100%;
        padding:50px 30px;
        box-sizing: border-box;
    }
</style>
<style>
  .el-tree {
      color:#fff;
  }
  .sideBar-container .el-tree > .el-tree-node{
      background: url(../../../assets/sideBar-titleBg1.png);
      background-size: 100% 100%;
      margin-bottom:18px;
      width:100%;
      min-height: 44px;
      box-sizing: border-box;
      text-align:center;
  }
  .el-tree-node__label {
      height:44px;
      line-height:44px;
  }
</style>
