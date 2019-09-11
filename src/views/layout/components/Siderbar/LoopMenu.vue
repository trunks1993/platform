<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <el-menu-item :index="item.path" v-if="!item.children.length">
      {{item.menuName }}
    </el-menu-item>
    <el-submenu v-else ref="subMenu" :index="item.path">
      <template slot="title">
          {{item.menuName }}
      </template>
      <LoopMenu v-for="child in item.children" :key="child.path" :item="child"/>
    </el-submenu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "LoopMenu",
  props: {
    // route object
    item: {
      type: Object,
      required: true
    }
  },

  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
