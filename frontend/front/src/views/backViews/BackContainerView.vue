<script setup>
import {onMounted, ref} from "vue";
import {getAdminInfoByID} from "../../api/api.js";

const adminName = ref('')
onMounted(() => {
  getAdminInfoByID(sessionStorage.getItem('adminID')).then(res => {
    adminName.value = res.data.name
  }).catch(err => {
    console.log(err)
  })
})
</script>

<template>
  <div class="common-layout">
    <el-container class="el-container">
      <el-header class="el-header">
        <h1 class="el-header-left">后台管理系统</h1>
        <h1 class="el-header-right">欢迎{{ adminName }}管理员</h1>
      </el-header>
      <el-container class="el-container">
        <el-aside class="el-aside" style="background-color: #324057">
          <el-menu
              active-text-color="#ffd04b"
              background-color="#324057"
              class="el-menu-vertical-demo"
              default-active="/back/backPerson"
              text-color="#fff"
              :router="true"
          >
            <el-divider />
            <el-menu-item index="/back/backPerson">
              <span>个人信息管理</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="2">
              <span>用户信息管理</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="3">
              <span>图书信息管理</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="4">
              <span>图书推荐管理</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="5">
              <span>用户评价管理</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="6">
              <span>用户借阅管理</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="7">
              <span>管理员信息管理</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="/login">
              <span>图书推荐系统</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
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
  background-color: #324057;
  color: #f6f6f1;
  height: 80px;
}

.el-aside {
  width: 200px;
}

.el-header-left {
  margin: 20px;
}
.el-header-right{
  position: absolute;
  left: 80%;
  bottom: 92%;
  color: #0bee75;
}
</style>