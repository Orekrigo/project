<script setup>
import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {deleteBook, getBookAllList, postBookInfo, putBookInfo, searchBook} from "../../api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import moment from "moment";

const input = ref('')
const tableData = reactive([])
const tableNowData = reactive([])
const moreInfo = ref(false)
const moreInfoForm = reactive({})
const editOrAdd = ref(1)
const ruleFormRef = ref()
const bookId = ref()
const searchBookData = reactive({
  current: 1,
  count: 50,
  pageSize: 10
})
const dialogFormVisible = ref(false)
const form = reactive({
  title: '',
  author: '',
  score: 0,
  score_number: 0,
  publish: '',
  date: '',
  price: '',
  picture: '',
  classification: '',
  intro: '',
  authorintro: '',
  directory: ''
})
const nullForm = reactive({
  title: '',
  author: '',
  score: 0,
  score_number: 0,
  publish: '',
  date: '',
  price: '',
  picture: '',
  classification: '',
  intro: '',
  authorintro: '',
  directory: ''
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
const getData = () => {
  searchBookData.current = 1
  tableData.length = 0
  tableNowData.length = 0
  getBookAllList().then(res => {
    tableData.push(...res.data)
    searchBookData.count = res.data.length
    tableNowData.push(...tableData.slice(0, searchBookData.pageSize))
  }).catch(err => {
    alertError(err)
  })
}
onMounted(() => {
  getData()
})
const addBook = () => {
  Object.assign(form, nullForm)
  editOrAdd.value = 1
  dialogFormVisible.value = true
}
const bookInfoEdit = (index, row) => {
  Object.assign(form, row)
  editOrAdd.value = 2
  dialogFormVisible.value = true
}
const bookInfoDelete = (index, row) => {
  ElMessageBox.confirm(`确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    deleteBook(row.id).then(() => {
      alertSuccess("删除成功")
      getData()
    }).catch(err => {
      alertError(err)
    })
  })
}

const bookInfoDetail = (index, row) => {
  moreInfoForm.intro = row.intro
  moreInfoForm.authorintro = row.authorintro
  moreInfoForm.directory = row.directory
  moreInfo.value = true
}
const changeBook = (val) => {
  searchBookData.current = val
  let start = (val - 1) * searchBookData.pageSize
  let end = val * searchBookData.pageSize
  tableNowData.length = 0
  tableNowData.push(...tableData.slice(start, end))
}

const searchBookInfo = () => {
  searchBook(input.value).then(res => {
    alertSuccess("搜索成功！")
    tableData.length = 0
    tableNowData.length = 0
    searchBookData.current = 1
    tableData.push(...res.data)
    searchBookData.count = res.data.length
    tableNowData.push(...tableData.slice(0, searchBookData.pageSize))
  }).catch(err => {
    alertError(err)
  })
}
const rules = reactive({
  title: [
    {required: true, message: '请输入书名'}
  ],
  author: [
    {required: true, message: '请输入作者'}
  ],
  score: [
    {required: true}
  ],
  score_number: [
    {required: true}
  ],
  publish: [
    {required: true, message: '请输入出版社'}
  ],
  date: [
    {required: true}
  ],
  price: [
    {required: true, message: '请输入价格'}
  ],
  picture: [
    {required: true, message: '请输入封面网址'}
  ],
  classification: [
    {required: true, message: '请输入类别'}
  ],
  intro: [
    {required: true, message: '请输入图书简介'}
  ],
  authorintro: [
    {required: true, message: '请输入作者简介'}
  ],
  directory: [
    {required: true, message: '请输入目录'}
  ],
})
const submitForm = async (formEl, val) => {
  if (!formEl) return
  await formEl.validate((valid) => {
        if (valid) {
          if (val === 1) {
            form.date = moment(form.date).format('YYYY-MM-DD');
            postBookInfo(form).then(() => {
              dialogFormVisible.value = false
              getData()
              alertSuccess('增加图书成功')
            }).catch(err => {
              alertError(err)
            })
          } else {
            form.date = moment(form.date).format('YYYY-MM-DD');
            bookId.value = form.id
            delete form.id
            dialogFormVisible.value = false
            console.log(form, bookId.value)
            putBookInfo(bookId.value, form).then(() => {
              alertSuccess("修改成功！")
              getData()
            }).catch(err => {
              alertError(err)
            })
          }
        } else {
          alertError('信息输入格式错误！！！')
        }
      }
  )
}
</script>

<template>
  <div>
    <el-divider/>
    <div>
      <el-button type="primary" @click="addBook">新增+</el-button>
      <div class="book-manage-top-right">
        <el-input
            v-model="input"
            style="width: 240px"
            size="default"
            placeholder="请输入(不输入搜索显示全部)"
            :prefix-icon="Search"
        />
        <el-button type="primary" style="margin-left: 10px" @click="searchBookInfo">搜索</el-button>
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
      <el-pagination :current-page="searchBookData.current" class="el-pagination-back-book" background
                     layout="prev, pager, next"
                     :total="searchBookData.count" :page-size="searchBookData.pageSize" @current-change="changeBook"/>
    </el-card>
  </div>
  <el-drawer
      v-model="moreInfo"
      title="更多信息"
      direction="rtl"
      size="50%"
  >
    <el-form :model="moreInfoForm">
      <el-form-item label="图书简介：">
        <el-text>{{ moreInfoForm.intro }}</el-text>
      </el-form-item>
      <el-form-item label="作者简介：">
        <el-text>{{ moreInfoForm.authorintro }}</el-text>
      </el-form-item>
      <el-form-item label="  目录：" style="white-space: pre-wrap;">
        <el-text>{{ moreInfoForm.directory }}</el-text>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-dialog v-model="dialogFormVisible" title="请输入图书信息" destroy-on-close
             class="el-dialog-user-back">
    <el-form :model="form" status-icon :rules="rules" ref="ruleFormRef">
      <el-form-item label="书名" class="el-form-item-user-back" prop="title" label-width="80px">
        <el-input v-model="form.title" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="作者" class="el-form-item-user-back" prop="author" label-width="80px">
        <el-input v-model="form.author" type="text" maxlength="255"/>
      </el-form-item>
      <el-form-item label="分数" class="el-form-item-user-back" prop="score" label-width="80px">
        <el-rate v-model="form.score" size="large" :max="10" show-score text-color="#ff9900"
                 score-template="{value} points"/>
      </el-form-item>
      <el-form-item label="评分人数" class="el-form-item-user-back" prop="score_number" label-width="80px">
        <el-input-number v-model="form.score_number" :min="0" :max="999999999" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="出版社" class="el-form-item-user-back" prop="publish" label-width="80px">
        <el-input v-model="form.publish" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="出版日期" class="el-form-item-user-back" prop="date" label-width="80px">
        <el-date-picker v-model="form.date" type="date"/>
      </el-form-item>
      <el-form-item label="价格" class="el-form-item-user-back" prop="price" label-width="80px">
        <el-input v-model="form.price" type="number" maxlength="32"/>
      </el-form-item>
      <el-form-item label="封面" class="el-form-item-user-back" prop="picture" label-width="80px">
        <el-input v-model="form.picture" type="text" maxlength="64"/>
      </el-form-item>
      <el-form-item label="分类" class="el-form-item-user-back" prop="classification" label-width="80px">
        <el-input v-model="form.classification" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="图书简介" class="el-form-item-user-back" prop="intro" label-width="80px">
        <el-input v-model="form.intro" type="textarea"/>
      </el-form-item>
      <el-form-item label="作者简介" class="el-form-item-user-back" prop="authorintro" label-width="80px">
        <el-input v-model="form.authorintro" type="textarea"/>
      </el-form-item>
      <el-form-item label="目录" class="el-form-item-user-back" prop="directory" label-width="80px">
        <el-input v-model="form.directory" type="textarea"/>
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