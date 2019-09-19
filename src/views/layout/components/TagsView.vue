<template>
  <div id="tags-view-container" class="tags-view-container">
    <!-- <scroll-pane ref="scrollPane" class="tags-view-wrapper"> -->
    <router-link
      v-for="tag in visitedViews"
      ref="tag"
      :key="tag.path"
      :class="{active: isActive(tag)}"
      :to="{ path: tag.path, query: tag.query }"
      tag="span"
      class="tags-view-item"
      @click.middle.native="closeSelectedTag(tag)"
    >
      {{ tag.title }}
      <span
        v-if="!tag.meta.affix"
        class="el-icon-close"
        @click.prevent.stop="closeSelectedTag(tag)"
      />
    </router-link>
    <!-- </scroll-pane> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTag: {},
      affixTags: []
    };
  },
  computed: {
    visitedViews() {
      return this.$store.getters.visitedViews;
    },
    routes() {
      return this.$store.getters.routers;
    }
  },
  watch: {
    $route() {
      this.addTags();
      //   this.moveToCurrentTag();
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  methods: { 
    isActive(route) {
      return route.path === this.$route.path;
    },
    filterAffixTags(routes) {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          tags.push({
            path: route.path,
            name: route.menuName,
            meta: route.meta,
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      console.log(this.routes, affixTags)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("addVisitedView", tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags(view) {
      this.$store.dispatch("delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    }
  }
};
</script>

<style lang="scss">
.tags-view-container {
  height: 26px;
  width: 100%;
  .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    color: #abaeb5;
    font-size: 12px;
    width: 127px;
    text-align: center;
    background: url(../../../assets/images/tags-bg.png) no-repeat;
    &:first-of-type {
      margin-left: 20px;
    }
    &:last-of-type {
      margin-right: 15px;
    }
    &.active {
      color: #fff;
      background: url(../../../assets/images/tags-bg-active.png) no-repeat;
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-item {
  .el-icon-close {
    vertical-align: 3px;
    text-align: center;
    position: absolute;
    right: 10px;
    &:hover {
      color: #fff;
    }
  }
}
</style>