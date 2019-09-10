<template>
  <div class="app-container">
    <Head></Head>
    <div class="app-container-content">
      <Sidebar></Sidebar>
      <AppMain></AppMain>
    </div>
  </div>
</template>
<script>
import { Head, Sidebar, AppMain } from './components'
export default {
  name: 'main',
  data() {
    return {

    };
  },
  components: {
    Head,
    Sidebar,
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
