<script setup>

</script>

<template>
  <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      background-color="#f6f6f1"
      text-color="#614e3c"
      :router="true"
      default-active="/content/home"
  >
    <span class="title">图书推荐系统</span>
    <div class="flex-grow" />
    <el-menu-item index="/content/home">首页(全部图书)</el-menu-item>
    <el-menu-item index="/content/borrowingRank">借阅排行榜</el-menu-item>
    <el-menu-item index="/content/borrowingRecords">借阅记录</el-menu-item>
    <el-menu-item index="/content/recommendation">图书推荐</el-menu-item>
    <el-menu-item index="/content/search">图书搜索</el-menu-item>
    <el-menu-item index="/content/classification">分类查找</el-menu-item>
    <el-menu-item index="/content/comment">评价记录</el-menu-item>
    <el-menu-item index="/content/person">个人信息</el-menu-item>
    <el-menu-item index="/backLogin">后台管理系统</el-menu-item>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
.title{
  font-size: 25px;
  color: #58402a;
  padding-top: 10px;
}
</style>