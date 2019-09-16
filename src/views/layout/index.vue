<template>
  <div class="app-container">
    <Header></Header>
    <div class="app-container-content">
      <Siderbar></Siderbar>
      <AppMain></AppMain>
    </div>
  </div>
</template>
<script>
import { Header, Siderbar, AppMain } from './components'
export default {
  data() {
    return {

    };
  },
  components: {
    Header,
    Siderbar,
    AppMain
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
    height: calc(100% - 118px);
    padding: 20px;
  }
}
</style>
