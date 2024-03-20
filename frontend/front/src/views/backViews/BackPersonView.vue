<script setup>
import {onMounted, reactive, ref} from "vue";
import {deleteAdminInfo, getAdminInfoByID, putAdminInfo} from "../../api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "../../router/index.js";

const personAdminForm = reactive({
  username: '',
  password: '',
  name: '',
  gender: '男',
  age: 0,
  address: '',
  email: '',
  phone: '',
})

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
const alertError = (info) => {
  ElMessage.error(`${info}`)
}

const male = ref('男')
const female = ref('女')
const adminID = ref(sessionStorage.getItem('adminID'))
let displayForm = ref(true)
onMounted(() => {
  getAdminInfoByID(adminID.value).then(res => {
    Object.assign(personAdminForm, res.data)
  }).catch(err => {
    alertError(err)
  })
})
let buttonControl = ref(true)

const editInfo = () => {
  displayForm.value = false
  buttonControl.value = false
}

const finishInfo = () => {
  displayForm.value = true
  buttonControl.value = true
  putAdminInfo(adminID.value, personAdminForm).then(() => {
    alertSuccess('修改信息成功')
  }).catch(err => {
    alertError(err)
  })
}

const quitLogin = () => {
  sessionStorage.clear()
  router.push({name: 'backLogin'})
  alertSuccess("退出成功！")
}
const deletePersonAdmin = () => {
  deleteAdminInfo(adminID.value).then(() => {
    alertSuccess("注销成功！")
    sessionStorage.clear()
    router.push({name: 'backLogin'})
  }).catch(err => {
    alertError(err)
  })
}
const messageTips = (text, buttonID) => {
  ElMessageBox.confirm(`${text}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    if (buttonID === 1) {
      editInfo()
    } else if (buttonID === 2) {
      finishInfo()
    } else if (buttonID === 3) {
      quitLogin()
    } else {
      deletePersonAdmin()
    }
  })
}
const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const ruleFormRef = ref()

</script>

<template>
  <el-card class="el-card-person-back">
    <el-form :model="personAdminForm" status-icon :rules="rules" ref="ruleFormRef" size="large" :disabled="displayForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model="personAdminForm.username" type="text" maxlength="32" disabled/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="personAdminForm.password" type="password" maxlength="32"/>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="personAdminForm.name" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="personAdminForm.gender">
          <el-radio :value="male">男</el-radio>
          <el-radio :value="female" style="padding-left: 10px">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="personAdminForm.age" :min="0" :max="200"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="personAdminForm.address" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="personAdminForm.email"/>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="personAdminForm.phone" type="text" maxlength="11" minlength="11" show-word-limit/>
      </el-form-item>
    </el-form>
  </el-card>
  <el-button v-if="buttonControl" type="primary" size="large" class="el-button-person-back"
             @click="messageTips('确定要修改个人信息吗？',1)">
    点击编辑信息
  </el-button>
  <el-button v-else type="primary" size="large" class="el-button-person-back"
             @click="messageTips('确定要保存个人信息吗？',2)">
    保存
  </el-button>
  <el-button type="warning" size="large" class="el-button-person-back-quit" @click="messageTips('确定要修改退出登录吗？',3)">
    点击退出登录
  </el-button>
  <el-button type="danger" size="large" class="el-button-person-back-delete" @click="messageTips('确定要注销账号吗？',4)">
    点击注销账号
  </el-button>
</template>

<style scoped>
.el-card-person-back {
  width: 700px;
  height: 580px;
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(-50%, -50%);
}

.el-button-person-back {
  position: absolute;
  top: 20%;
  left: 71%;
}

.el-button-person-back-delete {
  position: absolute;
  top: 40%;
  left: 70%;
}

.el-button-person-back-quit {
  position: absolute;
  top: 30%;
  left: 70%;
}
</style>