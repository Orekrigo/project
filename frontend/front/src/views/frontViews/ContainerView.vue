<script setup>

import HeaderComponent from "../../components/HeaderComponent.vue";
</script>

<template>
  <div class="common-layout">
    <el-container class="el-container">
      <el-header class="el-header">
        <HeaderComponent></HeaderComponent>
      </el-header>
      <el-main class="el-main">
        <router-view></router-view>
      </el-main>
      <el-footer class="el-footer">
        <div class="footer-text">欢迎光临本网站，祝你有好的体验</div>
      </el-footer>
    </el-container>
  </div>

</template>

<style scoped>

.common-layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.el-container {
  height: 100%;
}

.el-header {
  height: 80px;
  background-color: #f6f6f1;
  padding-top: 20px;
}

.el-main {

}

.el-footer {
  background-color: #545652;
  height: 30px;
}

.footer-text {
  font-size: medium;
  text-align: center;
  color: #f6f6f1;
}
</style>
