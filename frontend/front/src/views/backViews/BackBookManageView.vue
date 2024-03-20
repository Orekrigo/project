<script setup>
import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {getBookAllList} from "../../api/api.js";
import {ElMessageBox} from "element-plus";

const input1 = ref('')
const tableData = reactive([])
const tableNowData = reactive([])
const searchData = reactive({
  current: 1,
  count: 50,
  pageSize: 10
})
onMounted(() => {
  tableData.length = 0
  tableNowData.length = 0
  getBookAllList().then(res => {
    tableData.push(...res.data)
    searchData.count = res.data.length
    tableNowData.push(...tableData.slice(0, 10))
  }).catch(err => {
    alert(err)
  })
})
const addBook = (index, row) => {
  console.log(index, row)
}
const bookInfoEdit = (index, row) => {
  console.log(index, row)
}
const bookInfoDelete = (index, row) => {
  console.log(index, row)
}

const bookInfoDetail = (index, row) => {
  console.log(index, row)
}
const changeBook = (val) => {
  searchData.current = val
  let start = (val - 1) * searchData.pageSize
  let end = val * searchData.pageSize
  tableNowData.length = 0
  tableNowData.push(...tableData.slice(start, end))
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
</script>

<template>
  <div>
    <el-divider/>
    <div>
      <el-button type="primary">新增+</el-button>
      <div class="book-manage-top-right">
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
    <el-card class="el-card-back-book">
      <el-table :data="tableNowData" style="width: 100%" table-layout="auto">
        <el-table-column label="书名" prop="title"/>
        <el-table-column label="作者" prop="author"/>
        <el-table-column label="评分" prop="score"/>
        <el-table-column label="评分人数" prop="score_number"/>
        <el-table-column label="出版社" prop="publish"/>
        <el-table-column label="出版日期" prop="date"/>
        <el-table-column label="价格" prop="price"/>
        <el-table-column label="分类" prop="classification"/>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="default" @click="bookInfoDetail(scope.$index, scope.row)">更多信息</el-button>

            <el-button size="default" @click="bookInfoEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="default"
                type="danger"
                @click="bookInfoDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="searchData.current" class="el-pagination-back-book" background
                     layout="prev, pager, next"
                     :total="searchData.count" :page-size="searchData.pageSize" @current-change="changeBook"/>
    </el-card>
  </div>
</template>

<style scoped>
.book-manage-top-right {
  float: right;
  margin-right: 50px;
}

.el-card-back-book {
  margin-top: 50px;
}

.el-pagination-back-book {
  margin-top: 20px;
  float: right;
  margin-bottom: 20px;
}
</style>