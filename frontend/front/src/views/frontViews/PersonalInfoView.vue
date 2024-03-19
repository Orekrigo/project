<script setup>
import {onMounted, reactive, ref} from "vue";
import {deleteUser, putPersonalInfo, getUserIDDetail} from "../../api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "../../router/index.js";

const personForm = reactive({
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
const alertError = (info) => {
  ElMessage.error(`${info}`)
}

const male = ref('男')
const female = ref('女')
const userID = ref(sessionStorage.getItem('userID'))
let displayForm = ref(true)
onMounted(() => {
  getUserIDDetail(userID.value).then(res => {
    Object.assign(personForm, res.data)
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
  putPersonalInfo(userID.value, personForm).then(() => {
    alertSuccess('修改信息成功')
  }).catch(err => {
    alertError(err)
  })
}

const quitLogin = () => {
  sessionStorage.clear()
  router.push({name: 'login'})
  alertSuccess("退出成功！")
}
const deletePerson = () => {
  deleteUser(userID.value).then(() => {
    alertSuccess("注销成功！")
    sessionStorage.clear()
    router.push({name: 'login'})
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
      deletePerson()
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
  <el-card class="el-card-person">
    <el-form :model="personForm" status-icon :rules="rules" ref="ruleFormRef" size="large" :disabled="displayForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model="personForm.username" type="text" maxlength="32" disabled/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="personForm.password" type="password" maxlength="32"/>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="personForm.name" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="personForm.gender">
          <el-radio :value="male">男</el-radio>
          <el-radio :value="female" style="padding-left: 10px">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="personForm.age" :min="0" :max="200"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="personForm.address" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="personForm.email"/>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="personForm.phone" type="text" maxlength="11" minlength="11" show-word-limit/>
      </el-form-item>
      <el-form-item label="学历" prop="education" class="person-education">
        <el-select v-model="personForm.education" placeholder="Select" style="width: 240px">
          <el-option
              v-for="item in educationOptions"
              :key="item.id"
              :label="item.value"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="major" class="person-education">
        <el-input v-model="personForm.major" type="text" maxlength="32"/>
      </el-form-item>
    </el-form>
  </el-card>
  <el-button v-if="buttonControl" type="primary" size="large" class="el-button-person"
             @click="messageTips('确定要修改个人信息吗？',1)">
    点击编辑信息
  </el-button>
  <el-button v-else type="primary" size="large" class="el-button-person"
             @click="messageTips('确定要保存个人信息吗？',2)">
    保存
  </el-button>
  <el-button type="warning" size="large" class="el-button-person-quit" @click="messageTips('确定要修改退出登录吗？',3)">
    点击退出登录
  </el-button>
  <el-button type="danger" size="large" class="el-button-person-delete" @click="messageTips('确定要注销账号吗？',4)">
    点击注销账号
  </el-button>
</template>

<style scoped>
.el-card-person {
  width: 700px;
  height: 650px;
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(-50%, -50%);
}

.person-education {
  margin-left: 10px;
}

.el-button-person {
  position: absolute;
  top: 20%;
  left: 71%;
}

.el-button-person-delete {
  position: absolute;
  top: 40%;
  left: 70%;
}

.el-button-person-quit {
  position: absolute;
  top: 30%;
  left: 70%;
}
</style>