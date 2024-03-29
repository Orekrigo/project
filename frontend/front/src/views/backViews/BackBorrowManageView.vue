<script setup>
import {onMounted, reactive, ref} from "vue";
import {
  deleteBorrowInfo, getAllBorrowInfo,
  getBookByTitle,
  getBookDetail, getBorrowByUser, getRecommendByUser,
  getUserIDDetail,
  getUsernameDetail, postBorrowInfo, putBorrowInfo,
} from "../../api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import moment from "moment";
import {Search} from "@element-plus/icons-vue";

const input = ref('')
const tableData = reactive([])
const tableNowData = reactive([])
const borrowId = ref()
const searchBorrowData = reactive({
  current: 1,
  count: 50,
  pageSize: 10
})
const dialogFormVisible = ref(false)
const form = reactive({})
const nullForm = reactive({})
const rules = reactive({
  borrowtime: [
    {required: true},
  ],
  username: [
    {required: true, message: '请输入内容'}
  ],
  title: [
    {required: true, message: '请输入内容'}
  ],
})
const ruleFormRef = ref()
const editOrAdd = ref(1)
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
  searchBorrowData.current = 1
  tableData.length = 0
  tableNowData.length = 0
  getAllBorrowInfo().then(res => {
    tableData.push(...res.data)
    changeIDToName()
    searchBorrowData.count = res.data.length
    tableNowData.push(...tableData.slice(0, searchBorrowData.pageSize))
  }).catch(err => {
    alert(err)
  })
}
const changeIDToName = () => {
  for (let i = 0; i < tableData.length; i++) {
    tableData[i].borrowtime = moment(tableData[i].borrowtime).format('YYYY-MM-DD HH:mm:ss');
    if (tableData[i].returntime) {
      tableData[i].returntime = moment(tableData[i].returntime).format('YYYY-MM-DD HH:mm:ss');
    }
    getUserIDDetail(tableData[i].userid).then(res => {
      tableData[i].username = res.data.username
    }).catch(err => {
      alertError(err)
    })
    getBookDetail(tableData[i].bookid).then(res => {
      tableData[i].title = res.data.title
    }).catch(err => {
      alertError(err)
    })
  }
}
onMounted(() => {
  getData()
})
const borrowInfoEdit = (index, row) => {
  Object.assign(form, row)
  editOrAdd.value = 2
  dialogFormVisible.value = true
}
const borrowInfoDelete = (index, row) => {
  ElMessageBox.confirm(`确认删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    deleteBorrowInfo(row.id).then(() => {
      alertSuccess("删除成功！")
      getData()
    }).catch(err => {
      alertError(err)
    })
  })
}
const searchBorrowInfo = () => {
  if (!input.value) {
    getData()
  } else {
    getUsernameDetail(input.value).then(res => {
      if (!res.data.length) {
        alertError('不存在此用户！')
      } else {
        getBorrowByUser(res.data[0].id).then(res => {
          alertSuccess("搜索成功！")
          tableData.length = 0
          tableNowData.length = 0
          searchBorrowData.current = 1
          tableData.push(...res.data)
          changeIDToName()
          searchBorrowData.count = res.data.length
          tableNowData.push(...tableData.slice(0, searchBorrowData.pageSize))
        })
      }
    }).catch(err => {
      alertError(err)
    })
  }
}
const addBorrow = () => {
  Object.assign(form, nullForm)
  form.borrowtime = null
  form.returntime = null
  editOrAdd.value = 1
  dialogFormVisible.value = true
}
const changeBorrow = (val) => {
  searchBorrowData.current = val
  let start = (val - 1) * searchBorrowData.pageSize
  let end = val * searchBorrowData.pageSize
  tableNowData.length = 0
  tableNowData.push(...tableData.slice(start, end))
}
const submitForm = async (formEl, val) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      form.borrowtime = moment(form.borrowtime).format('YYYY-MM-DD HH:mm:ss')
      if (form.returntime) {
        form.returntime = moment(form.returntime).format('YYYY-MM-DD HH:mm:ss')
      }
      getUsernameDetail(form.username).then(res => {
        if (res.data.length) {
          form.userid = res.data[0].id
          delete form.username
          getBookByTitle(form.title).then(res => {
            if (res.data.results.length) {
              form.bookid = res.data.results[0].id
              delete form.title
              if (val === 1) {
                postBorrowInfo(form).then(() => {
                  dialogFormVisible.value = false
                  getData()
                  alertSuccess('增加成功')
                }).catch(err => {
                  alertError(err)
                })
              } else {
                borrowId.value = form.id
                delete form.id
                dialogFormVisible.value = false
                putBorrowInfo(borrowId.value, form).then(() => {
                  alertSuccess("修改成功！")
                  getData()
                }).catch(err => {
                  alertError(err)
                })
              }
            } else {
              alertError("没有此书！")
            }
          }).catch(err => {
            alertError(err)
          })
        } else {
          alertError("没有此用户！")
        }
      }).catch(err => {
        alertError(err)
      })
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
      <el-button type="primary" @click="addBorrow">新增+</el-button>
      <div class="borrow-manage-top-right">
        <el-input
            v-model="input"
            style="width: 240px"
            size="default"
            placeholder="根据用户账号搜索"
            :prefix-icon="Search"
        />
        <el-button type="primary" style="margin-left: 10px" @click="searchBorrowInfo">搜索</el-button>
      </div>
    </div>
    <el-card class="el-card-back-borrow">
      <el-table :data="tableNowData" style="width: 100%" table-layout="auto">
        <el-table-column label="用户账号" prop="username"/>
        <el-table-column label="书名" prop="title"/>
        <el-table-column label="借阅时间" prop="borrowtime"/>
        <el-table-column label="返还时间" prop="returntime"/>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="default" @click="borrowInfoEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="default"
                type="danger"
                @click="borrowInfoDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="searchBorrowData.current" class="el-pagination-back-borrow" background
                     layout="prev, pager, next"
                     :total="searchBorrowData.count" :page-size="searchBorrowData.pageSize"
                     @current-change="changeBorrow"/>
    </el-card>
  </div>
  <el-dialog v-model="dialogFormVisible" title="请输入借阅信息" destroy-on-close
             class="el-dialog-borrow-back">
    <el-form :model="form" status-icon :rules="rules" ref="ruleFormRef">
      <el-form-item label="用户账号" class="el-form-item-borrow-back" prop="username" label-width="80px">
        <el-input v-model="form.username" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="书名" class="el-form-item-borrow-back" prop="title" label-width="80px">
        <el-input v-model="form.title" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="借阅时间" class="el-form-item-borrow-back" prop="borrowtime" label-width="80px">
        <el-date-picker v-model="form.borrowtime" type="datetime"/>
      </el-form-item>
      <el-form-item label="返还时间" class="el-form-item-borrow-back" prop="returntime" label-width="80px">
        <el-date-picker v-model="form.returntime" type="datetime"/>
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
.borrow-manage-top-right {
  float: right;
  margin-right: 50px;
}

.el-card-back-borrow {
  margin-top: 50px;
}

.el-pagination-back-borrow {
  margin-top: 20px;
  float: right;
  margin-bottom: 20px;
}

.el-form-item-borrow-back {
  text-align: center;
  align-items: center;
}

.el-dialog-borrow-back {
  background-color: #44854d;
}
</style>