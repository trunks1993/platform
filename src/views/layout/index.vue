<template>
  <div class="app-container">
    <Header></Header>
    <div class="app-container-content">
      <Siderbar></Siderbar>
      <div class="app-container-content-box">
        <TagsView></TagsView>
        <AppMain></AppMain>
      </div>
    </div>
  </div>
</template>
<script>
import { Header, Siderbar, AppMain, TagsView } from './components'
export default {
  data() {
    return {

    };
  },
  components: {
    Header,
    Siderbar,
    AppMain,
    TagsView,
  },
  methods: {

  }
};

</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  background: url(../../assets/login-Bg.png);
  background-size: 100% 100%;

  &-content {
    display: flex;
    height: calc(100% - 100px);
    padding: 20px;
    padding-top: 0;
    overflow-x: hidden;
    &-box {
      width: calc(100% - 284px);
    }
  }
}
</style>
