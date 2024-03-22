<script setup>
import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {
  deleteCommentInfo,
  getBookByTitle,
  getBookDetail,
  getCommentList,
  getUserIDDetail,
  getUsernameDetail, postComment, putComment,
  searchComment
} from "../../api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";
import moment from "moment";

const input = ref('')
const tableData = reactive([])
const tableNowData = reactive([])
const commentId = ref()
const searchCommentData = reactive({
  current: 1,
  count: 50,
  pageSize: 10
})
const dialogFormVisible = ref(false)
const form = reactive({
  content: '',
  score: 0,
  time: '',
  userid: 0,
  bookid: 0
})
const nullForm = reactive({
  content: '',
  score: 0,
  time: '',
  userid: 0,
  bookid: 0
})
const rules = reactive({
  content: [
    {required: true, message: '请输入内容', trigger: 'blur'},
    {min: 1, max: 255, message: '长度应该是1-255', trigger: 'blur'}
  ],
  score: [
    {required: true},
  ],
  time: [
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
  searchCommentData.current = 1
  tableData.length = 0
  tableNowData.length = 0
  getCommentList().then(res => {
    tableData.push(...res.data)
    changeIDToName()
    searchCommentData.count = res.data.length
    tableNowData.push(...tableData.slice(0, searchCommentData.pageSize))
  }).catch(err => {
    alert(err)
  })
}
const changeIDToName = () => {
  for (let i = 0; i < tableData.length; i++) {
    tableData[i].time = moment(tableData[i].time).format('YYYY-MM-DD HH:mm:ss');
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
const commentInfoEdit = (index, row) => {
  Object.assign(form, row)
  editOrAdd.value = 2
  dialogFormVisible.value = true
}
const commentInfoDelete = (index, row) => {
  ElMessageBox.confirm(`确认删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    deleteCommentInfo(row.id).then(() => {
      alertSuccess("删除成功！")
      getData()
    }).catch(err => {
      alertError(err)
    })
  })
}
const addComment = () => {
  Object.assign(form, nullForm)
  editOrAdd.value = 1
  dialogFormVisible.value = true
}
const changeComment = (val) => {
  searchCommentData.current = val
  let start = (val - 1) * searchCommentData.pageSize
  let end = val * searchCommentData.pageSize
  tableNowData.length = 0
  tableNowData.push(...tableData.slice(start, end))
}
const searchCommentInfo = () => {
  searchComment(input.value).then(res => {
    alertSuccess("搜索成功！")
    tableData.length = 0
    tableNowData.length = 0
    searchCommentData.current = 1
    tableData.push(...res.data)
    changeIDToName()
    searchCommentData.count = res.data.length
    tableNowData.push(...tableData.slice(0, searchCommentData.pageSize))
  }).catch(err => {
    alertError(err)
  })
}
const submitForm = async (formEl, val) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      form.time = moment(form.time).format('YYYY-MM-DD HH:mm:ss')
      getUsernameDetail(form.username).then(res => {
        if (res.data.length) {
          form.userid = res.data[0].id
          delete form.username
          getBookByTitle(form.title).then(res => {
            if (res.data.results.length) {
              form.bookid = res.data.results[0].id
              delete form.title
              if (val === 1) {
                postComment(form).then(() => {
                  dialogFormVisible.value = false
                  getData()
                  alertSuccess('增加成功')
                }).catch(err => {
                  alertError(err)
                })
              } else {
                commentId.value = form.id
                delete form.id
                dialogFormVisible.value = false
                putComment(commentId.value, form).then(() => {
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
      <el-button type="primary" @click="addComment">新增+</el-button>
      <div class="comment-manage-top-right">
        <el-input
            v-model="input"
            style="width: 240px"
            size="default"
            placeholder="根据评论内容搜索"
            :prefix-icon="Search"
        />
        <el-button type="primary" style="margin-left: 10px" @click="searchCommentInfo">搜索</el-button>
      </div>
    </div>
    <el-card class="el-card-back-comment">
      <el-table :data="tableNowData" style="width: 100%" table-layout="auto">
        <el-table-column label="用户账号" prop="username"/>
        <el-table-column label="书名" prop="title"/>
        <el-table-column label="评分" prop="score"/>
        <el-table-column label="评价时间" prop="time"/>
        <el-table-column label="评论内容" prop="content"/>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="default" @click="commentInfoEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="default"
                type="danger"
                @click="commentInfoDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="searchCommentData.current" class="el-pagination-back-comment" background
                     layout="prev, pager, next"
                     :total="searchCommentData.count" :page-size="searchCommentData.pageSize"
                     @current-change="changeComment"/>
    </el-card>
  </div>
  <el-dialog v-model="dialogFormVisible" title="请输入评价信息" destroy-on-close
             class="el-dialog-comment-back">
    <el-form :model="form" status-icon :rules="rules" ref="ruleFormRef">
      <el-form-item label="用户账号" class="el-form-item-comment-back" prop="username" label-width="80px">
        <el-input v-model="form.username" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="书名" class="el-form-item-comment-back" prop="title" label-width="80px">
        <el-input v-model="form.title" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="评分" class="el-form-item-comment-back" prop="score" label-width="80px">
        <el-rate v-model="form.score" size="large" :max="10" show-score text-color="#ff9900"
                 score-template="{value} points"/>
      </el-form-item>
      <el-form-item label="评价时间" class="el-form-item-comment-back" prop="time" label-width="80px">
        <el-date-picker v-model="form.time" type="datetime"/>
      </el-form-item>
      <el-form-item label="评论内容" class="el-form-item-comment-back" prop="content" label-width="80px">
        <el-input v-model="form.content" type="textarea"/>
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
.comment-manage-top-right {
  float: right;
  margin-right: 50px;
}

.el-card-back-comment {
  margin-top: 50px;
}

.el-pagination-back-comment {
  margin-top: 20px;
  float: right;
  margin-bottom: 20px;
}

.el-form-item-comment-back {
  text-align: center;
  align-items: center;
}

.el-dialog-comment-back {
  background-color: #44854d;
}
</style>