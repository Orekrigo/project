<script setup>
import {onMounted, reactive, ref} from "vue";
import {deleteCommentInfo, getBookDetail, getCommentByUserID, putBookInfo, putComment} from "../../api/api.js";
import {ElMessage} from "element-plus";
import moment from "moment";

const bookInfoChanged = reactive({})
const commentInfo = reactive([])
const userID = sessionStorage.getItem('userID')
const dialogFormVisible = ref(false)
const form = reactive({})
const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const alertError = (info) => {
  ElMessage.error(`${info}`)
}
const getCommentData = (id) => {
  getCommentByUserID(id).then(res => {
    commentInfo.length = 0
    commentInfo.push(...res.data)
    for (let item of commentInfo) {
      getBookDetail(item.bookid).then(res => {
        item.title = res.data.title
      })
      item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
    }
  }).catch(err => {
    alertError(err)
  })
}
onMounted(() => {
  getCommentData(userID)
})

const deleteCommentFun = (item) => {
  deleteCommentInfo(item.id).then(() => {
    getCommentData(userID)
    getBookDetail(item.bookid).then(res => {
      Object.assign(bookInfoChanged, res.data)
      let num = (bookInfoChanged.score * bookInfoChanged.score_number - bookInfoChanged.score) / (bookInfoChanged.score_number - 1)
      bookInfoChanged.score = parseFloat(num.toFixed(1))
      bookInfoChanged.score_number -= 1
      putBookInfo(item.bookid, bookInfoChanged).then(() => {
        alertSuccess("删除成功")
      })
    }).catch(err => {
      alertError(err)
    })
  }).catch(err => {
    alertError(err)
  })
}
const editCommentFun = (item) => {
  Object.assign(form, item)
  dialogFormVisible.value = true
}
const putCommentFun = () => {
  let id = form.id
  delete form.id
  delete form.title
  form.time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  console.log(form)
  putComment(id, form).then(() => {
    alertSuccess("修改成功")
    dialogFormVisible.value = false
    getCommentData(userID)
  }).catch(err => {
    alertError(err)
  })
}
</script>

<template>
  <div class="root-comment">
    <div class="comment-container">
      <h2>评价记录：</h2>
      <div>您共有{{ commentInfo.length }}条评价记录</div>
      <div>
        <el-card class="comment-container-card" v-if="commentInfo.length" v-for="item in commentInfo" :key="item.id">
          <div>
            <span>书名：</span>
            <span style="margin-right: 50px;color: dodgerblue"> {{ item.title }}</span>
            <span style="margin-right: 50px">
               <el-rate
                   class="el-rate-detail"
                   v-model="item.score"
                   disabled
                   show-score
                   text-color="#ff9900"
                   :max=10
               />
              </span>
            <span style="color: #aaaaaa">{{ item.time }}</span>
          </div>
          <div style="margin-top: 20px;color: #53c70e">评论内容：</div>
          <div style="margin-top: 10px">
            {{ item.content }}
          </div>
          <div class="button-comment-container">
            <el-button type="warning" @click="editCommentFun(item)">修改内容</el-button>
            <el-button type="danger" @click="deleteCommentFun(item)">删除评论</el-button>
          </div>
        </el-card>
        <div v-else style="text-align: center">您还没有评价过</div>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogFormVisible" title="填写评价信息" width="500">
    <el-form :model="form">
      <el-form-item label="评分">
        <el-rate
            class="el-rate-detail"
            v-model="form.score"
            show-score
            text-color="#ff9900"
            :max=10
        />
      </el-form-item>
      <el-form-item label="评论内容">
        <el-input type="textarea" v-model="form.content"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="putCommentFun">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.comment-container {
  margin-top: 20px;
}

.comment-container-card {
  width: 100%;
  height: 100%;
  margin-top: 20px;
}

.root-comment {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 400px;
  padding-right: 400px;
}

.button-comment-container {
  margin-top: 20px;
  margin-left: 600px;
  width: 200px;
}
</style>