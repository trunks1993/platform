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
  padding: 40px 20px 20px;
  background: url(../../../../assets/images/sideBar-bg.png);
  background-size: 100% 100%;
}
</style>
