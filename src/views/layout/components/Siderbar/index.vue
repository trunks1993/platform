<template>
  <div class="sider-bar">
    <el-menu router>
        <LoopMenu v-for="route in routers" :key="route.path" :item="route"/>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LoopMenu from './LoopMenu';

export default {
  components: {
    LoopMenu
  },
  computed: {
    ...mapGetters(["routers"])
  },

  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.sider-bar {
  width: 269px;
  height: 100%;
  // background: url(../../../assets/sideBar-bg.png);
  background-size: 100% 100%;
}
</style>
