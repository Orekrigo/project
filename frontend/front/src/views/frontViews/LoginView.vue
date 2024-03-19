<script setup>
import {reactive, ref} from "vue";
import {getUsernameDetail, postRegister} from "../../api/api.js";
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
const login = () => {
  getUsernameDetail(loginForm.username).then(res => {
    if (!res.data[0] || !loginForm.username) {
      alertError("账号输入错误！")
    } else if (res.data[0].password !== loginForm.password) {
      alertError("密码输入错误！")
    } else {
      alertSuccess('登录成功!')
      sessionStorage.setItem('userID', res.data[0].id)
      sessionStorage.removeItem('adminID')
      router.push({name: 'home'})
    }
  }).catch(err => {
    console.log(err)
    alertError(err)
  })
}
const dialogFormVisible = ref(false)
const registerForm = reactive({
  username: '',
  password: '',
  name: '',
  gender: '男',
  age: 0,
  address: '',
  email: '',
  phone: '',
  education: '',
  major: ''
})

const male = ref('男')
const female = ref('女')
const educationOptions = reactive([
  {id: 1, value: '研究生'},
  {id: 2, value: '本科'},
  {id: 3, value: '专科'},
  {id: 4, value: '高中'},
  {id: 5, value: '其他'}
])

const rules = reactive({
  username: [
    {required: true, message: '请输入账号', trigger: 'blur'},
    {min: 3, max: 32, message: '长度应该是3-32', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 3, max: 32, message: '长度应该是3-32', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '请输入姓名', trigger: 'blur'},
    {min: 2, max: 32, message: '长度应该是2-32', trigger: 'blur'}
  ],
  gender: [
    {required: true}
  ],
  age: [
    {required: true}
  ],
  address: [
    {required: true, message: '请输入地址', trigger: 'blur'},
    {min: 3, max: 32, message: '长度应该是3-32', trigger: 'blur'}
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change']}
  ],
  phone: [
    {required: true, message: '请输入', trigger: 'blur'},
    {min: 11, max: 11, message: '长度应该是11', trigger: 'blur'}
  ],
})

const ruleFormRef = ref()
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      getUsernameDetail(registerForm.username).then(res => {
        if (!res.data[0]) {
          postRegister(registerForm).then(() => {
            dialogFormVisible.value = false
            alertSuccess('注册成功，请登录')
          }).catch(err => {
            alertError(err)
          })
        } else {
          alertError('该用户已存在')
        }
      }).catch(err => {
        alertError(err)
      })
    } else {
      alertError('个人信息输入格式错误！！！')
    }
  })
}
</script>

<template>
  <div class="login-container">
    <el-card class="el-card-login">
      <h1>图书推荐系统</h1>
      <el-form :model="loginForm" class="el-form-login" size="large">
        <el-form-item label="账号" class="el-form-item-login">
          <el-input v-model="loginForm.username"/>
        </el-form-item>
        <el-form-item label="密码 " class="el-form-item-login">
          <el-input v-model="loginForm.password" type="password"/>
        </el-form-item>
        <el-form-item class="el-form-item-login el-button-login">
          <el-button class="el-button-login-item" type="primary" @click="login">登录</el-button>
          <el-button class="el-button-login-item register-button" @click="dialogFormVisible = true">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog v-model="dialogFormVisible" title="请输入注册个人信息" fullscreen destroy-on-close
               class="el-dialog-register">
      <el-form :model="registerForm" status-icon :rules="rules" ref="ruleFormRef">
        <el-form-item label="账号" class="el-form-item-register" prop="username">
          <el-input v-model="registerForm.username" type="text" maxlength="32"/>
        </el-form-item>
        <el-form-item label="密码" class="el-form-item-register" prop="password">
          <el-input v-model="registerForm.password" type="password" maxlength="32"/>
        </el-form-item>
        <el-form-item label="姓名" class="el-form-item-register" prop="name">
          <el-input v-model="registerForm.name" type="text" maxlength="32"/>
        </el-form-item>
        <el-form-item label="性别" class="el-form-item-register" prop="gender">
          <el-radio-group v-model="registerForm.gender">
            <el-radio :value="male">男</el-radio>
            <el-radio :value="female" style="padding-left: 10px">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" class="el-form-item-register" prop="age">
          <el-input-number v-model="registerForm.age" :min="0" :max="200"/>
        </el-form-item>
        <el-form-item label="地址" class="el-form-item-register" prop="address">
          <el-input v-model="registerForm.address" type="text" maxlength="32"/>
        </el-form-item>
        <el-form-item label="邮箱" class="el-form-item-register" prop="email">
          <el-input v-model="registerForm.email"/>
        </el-form-item>
        <el-form-item label="手机" class="el-form-item-register" prop="phone">
          <el-input v-model="registerForm.phone" type="text" maxlength="11" minlength="11" show-word-limit/>
        </el-form-item>
        <el-form-item label="学历" class="el-form-item-register" prop="education">
          <el-select v-model="registerForm.education" placeholder="Select" style="width: 240px">
            <el-option
                v-for="item in educationOptions"
                :key="item.id"
                :label="item.value"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="专业" class="el-form-item-register" prop="major">
          <el-input v-model="registerForm.major" type="text" maxlength="32"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
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
  background-color: dodgerblue;
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

.el-form-item-register {
  padding-top: 20px;
  width: 500px;
  position: relative;
  left: 50%;
  transform: translate(-50%);
  height: 50px;
  text-align: center;
  align-items: center;
}

.el-dialog-register {
  background-color: #44854d;
}
</style>