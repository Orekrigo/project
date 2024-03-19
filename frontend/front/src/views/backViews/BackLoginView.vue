<script setup>
import {reactive, ref} from "vue";
import {getAdminInfoByUsername, getUsernameDetail, postRegister} from "../../api/api.js";
import router from "../../router/index.js";
import {ElMessage} from 'element-plus'

const loginForm = reactive({
  username: '',
  password: '',
})
const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const alertError = (info) => {
  ElMessage.error(`${info}`)
}
const adminLogin = () => {
  getAdminInfoByUsername(loginForm.username).then(res => {
    console.log(res)
    if (!res.data[0]) {
      alertError("账号输入错误！")
    } else if (res.data[0].password !== loginForm.password) {
      alertError("密码输入错误！")
    } else {
      alertSuccess('登录成功!')
      sessionStorage.setItem('adminID', res.data[0].id)
      sessionStorage.removeItem('userID')
      router.push({name: 'back'})
    }
  }).catch(err => {
    console.log(err)
    alertError(err)
  })
}
const cancel = () => {
  router.back()
}

</script>

<template>
  <div class="login-container">
    <el-card class="el-card-login">
      <h1>后台管理系统</h1>
      <el-form :model="loginForm" class="el-form-login" size="large">
        <el-form-item label="账号" class="el-form-item-login">
          <el-input v-model="loginForm.username"/>
        </el-form-item>
        <el-form-item label="密码 " class="el-form-item-login">
          <el-input v-model="loginForm.password" type="password"/>
        </el-form-item>
        <el-form-item class="el-form-item-login el-button-login">
          <el-button class="el-button-login-item" type="primary" @click="adminLogin">登录</el-button>
          <el-button class="el-button-login-item register-button" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
* {
  text-align: center;
  margin: 0;
  padding: 0;
}

.el-card-login {
  width: 400px;
  height: 400px;
  background-color: rgba(199, 191, 191, 0.6);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-container {
  background-color: #56e3fc;
  height: 100vh;
}

.el-form-login {
  padding-top: 40px;
}

.el-form-item-login {
  padding-top: 30px;
}

.el-button-login {
  position: relative;
  left: 20%;
  padding-top: 50px;
}

.el-button-login-item {
  padding-left: 20px;
  padding-right: 20px;
}

.register-button {
  margin-left: 75px;
}

</style>