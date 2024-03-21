<script setup>
import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {
  deleteAdminInfo, getAdminInfoByUsername,
  getAdminList, postAdminInfo, putAdminInfo, searchAdmin
} from "../../api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";

const input = ref('')
const tableData = reactive([])
const tableNowData = reactive([])
const searchAdminData = reactive({
  current: 1,
  count: 50,
  pageSize: 10
})
const dialogFormVisible = ref(false)
const form = reactive({
  username: '',
  password: '',
  name: '',
  gender: '男',
  age: 0,
  address: '',
  email: '',
  phone: '',
})
const nullForm = reactive({
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
const ruleFormRef = ref()
const male = ref('男')
const female = ref('女')
const editOrAdd = ref(1)
const adminId = ref()
const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const alertError = (info) => {
  ElMessage.error(`${info}`)
}
const getData = () => {
  searchAdminData.current = 1
  tableData.length = 0
  tableNowData.length = 0
  getAdminList().then(res => {
    tableData.push(...res.data)
    searchAdminData.count = res.data.length
    tableNowData.push(...tableData.slice(0, searchAdminData.pageSize))
  }).catch(err => {
    alert(err)
  })
}
onMounted(() => {
  getData()
})
const adminInfoEdit = (index, row) => {
  Object.assign(form, row)
  editOrAdd.value = 2
  dialogFormVisible.value = true
}
const adminInfoDelete = (index, row) => {
  ElMessageBox.confirm(`确认删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    deleteAdminInfo(row.id).then(() => {
      alertSuccess("删除成功！")
      getData()
    }).catch(err => {
      alertError(err)
    })
  })
}
const addAdmin = () => {
  Object.assign(form, nullForm)
  editOrAdd.value = 1
  dialogFormVisible.value = true
}
const changeAdmin = (val) => {
  searchAdminData.current = val
  let start = (val - 1) * searchAdminData.pageSize
  let end = val * searchAdminData.pageSize
  tableNowData.length = 0
  tableNowData.push(...tableData.slice(start, end))
}
const searchAdminInfo = () => {
  searchAdmin(input.value).then(res => {
    alertSuccess("搜索成功！")
    tableData.length = 0
    tableNowData.length = 0
    searchAdminData.current = 1
    tableData.push(...res.data)
    searchAdminData.count = res.data.length
    tableNowData.push(...tableData.slice(0, searchAdminData.pageSize))
  }).catch(err => {
    alertError(err)
  })
}
const submitForm = async (formEl, val) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (val === 1) {
        getAdminInfoByUsername(form.username).then(res => {
          if (!res.data[0]) {
            postAdminInfo(form).then(() => {
              dialogFormVisible.value = false
              getData()
              alertSuccess('增加成功')
            }).catch(err => {
              alertError(err)
            })
          } else {
            alertError('该管理员已存在')
          }
        }).catch(err => {
          alertError(err)
        })
      } else {
        adminId.value = form.id
        delete form.id
        dialogFormVisible.value = false
        putAdminInfo(adminId.value, form).then(() => {
          alertSuccess("修改成功！")
          getData()
        }).catch(err => {
          alertError(err)
        })
      }
    } else {
      alertError('信息输入格式错误！！！')
    }
  })
}
</script>

<template>
  <div>
    <el-divider/>
    <div>
      <el-button type="primary" @click="addAdmin">新增+</el-button>
      <div class="admin-manage-top-right">
        <el-input
            v-model="input"
            style="width: 240px"
            size="default"
            placeholder="请输入(不输入搜索显示全部)"
            :prefix-icon="Search"
        />
        <el-button type="primary" style="margin-left: 10px" @click="searchAdminInfo">搜索</el-button>
      </div>
    </div>
    <el-card class="el-card-back-admin">
      <el-table :data="tableNowData" style="width: 100%" table-layout="auto">
        <el-table-column label="账号" prop="username"/>
        <el-table-column label="密码" prop="password"/>
        <el-table-column label="姓名" prop="name"/>
        <el-table-column label="性别" prop="gender"/>
        <el-table-column label="年龄" prop="age"/>
        <el-table-column label="地址" prop="address"/>
        <el-table-column label="邮箱" prop="email"/>
        <el-table-column label="手机号" prop="phone"/>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="default" @click="adminInfoEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="default"
                type="danger"
                @click="adminInfoDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="searchAdminData.current" class="el-pagination-back-admin" background
                     layout="prev, pager, next"
                     :total="searchAdminData.count" :page-size="searchAdminData.pageSize"
                     @current-change="changeAdmin"/>
    </el-card>
  </div>
  <el-dialog v-model="dialogFormVisible" title="请输入用户信息" destroy-on-close
             class="el-dialog-admin-back">
    <el-form :model="form" status-icon :rules="rules" ref="ruleFormRef">
      <el-form-item label="账号" class="el-form-item-admin-back" prop="username">
        <el-input v-model="form.username" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="密码" class="el-form-item-admin-back" prop="password">
        <el-input v-model="form.password" type="password" maxlength="32"/>
      </el-form-item>
      <el-form-item label="姓名" class="el-form-item-admin-back" prop="name">
        <el-input v-model="form.name" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="性别" class="el-form-item-admin-back" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio :value="male">男</el-radio>
          <el-radio :value="female" style="padding-left: 10px">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" class="el-form-item-admin-back" prop="age">
        <el-input-number v-model="form.age" :min="0" :max="200"/>
      </el-form-item>
      <el-form-item label="地址" class="el-form-item-admin-back" prop="address">
        <el-input v-model="form.address" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="邮箱" class="el-form-item-admin-back" prop="email">
        <el-input v-model="form.email"/>
      </el-form-item>
      <el-form-item label="手机" class="el-form-item-admin-back" prop="phone">
        <el-input v-model="form.phone" type="number" maxlength="11" minlength="11" show-word-limit/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef, editOrAdd)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.admin-manage-top-right {
  float: right;
  margin-right: 50px;
}

.el-card-back-admin {
  margin-top: 50px;
}

.el-pagination-back-admin {
  margin-top: 20px;
  float: right;
  margin-bottom: 20px;
}

.el-form-item-admin-back {
  text-align: center;
  align-items: center;
}

.el-dialog-admin-back {
  background-color: #44854d;
}
</style>