<script setup>
import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {getUserList} from "../../api/api.js";

const input1 = ref('')
const tableData = reactive([])
onMounted(() => {
  tableData.length = 0
  getUserList().then(res => {
    tableData.push(...res.data)
  }).catch(err => {
    alert(err)
  })
})
const userInfoEdit = (index, row) => {
  console.log(index, row)
}
const userInfoDelete = (index, row) => {
  console.log(index, row)
}

</script>

<template>
  <div>
    <el-divider/>
    <div>
      <el-button type="primary">新增+</el-button>
      <div class="user-manage-top-right">
        <el-input
            v-model="input1"
            style="width: 240px"
            size="default"
            placeholder="请输入"
            :prefix-icon="Search"
        />
        <el-button type="primary" style="margin-left: 10px">搜索</el-button>
      </div>
    </div>
    <el-card class="el-card-back-user">
      <el-table :data="tableData" style="width: 100%" table-layout="auto">
        <el-table-column label="账号" prop="username"/>
        <el-table-column label="密码" prop="password"/>
        <el-table-column label="姓名" prop="name"/>
        <el-table-column label="性别" prop="gender"/>
        <el-table-column label="年龄" prop="age"/>
        <el-table-column label="地址" prop="address"/>
        <el-table-column label="邮箱" prop="email"/>
        <el-table-column label="手机号" prop="phone"/>
        <el-table-column label="学历" prop="education"/>
        <el-table-column label="专业" prop="major"/>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="default" @click="userInfoEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="default"
                type="danger"
                @click="userInfoDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.user-manage-top-right {
  float: right;
  margin-right: 50px;
}

.el-card-back-user {
  margin-top: 20px;
}
</style>