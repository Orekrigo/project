<script setup>
import {useRoute} from "vue-router";
import {
  getBookDetail, getBorrowInfoByUserAndBook,
  getCommentByBookID,
  getUserIDDetail, postBorrowInfo,
  postComment,
  putBookInfo
} from "../../api/api.js";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {useImgStore} from "../../store/imgFun.js";
import router from "../../router/index.js";
import {ElMessage} from "element-plus";
import moment from "moment";


const route = useRoute()
let load = ref()
let bookDetailInfo = reactive({})
let controlInfoDisplay = reactive({
  moreInfoInfo: false,
  moreLineInfo: 5,
  moreLineAuthor: 5,
  moreInfoAuthor: false,
  moreInfoDirectory: false,
  moreLineDirectory: 5
})
const getData = (id) => {
  // id = parseInt(id)
  getBookDetail(id).then(res => {
    Object.assign(bookDetailInfo, res.data)
  }).catch(error => {
    load.value = error
  })
}
const getCommentData = (id) => {
  getCommentByBookID(id).then(res => {
    commentInfo.length = 0
    commentInfo.push(...res.data)
    for (let item of commentInfo) {
      getUserIDDetail(item.userid).then(res => {
        item.username = res.data.username
        item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
      })
    }
  }).catch(err => {
    alertError(err)
  })
}
let setIntervalFun = setInterval(() => {
  let timer = Date.now()
  myCommentInfo.time = moment(timer).format('YYYY-MM-DD HH:mm:ss')
  borrowInfoDetail.borrowtime = moment(timer).format('YYYY-MM-DD HH:mm:ss')
}, 1000)
onMounted(() => {
  getData(route.params.id)
  getCommentData(route.params.id)
})
onUnmounted(() => {
  clearInterval(setIntervalFun)
})

function goBack() {
  router.back()
}

const store = useImgStore()
const {getImgUrl} = store

function displayMoreInfo() {
  controlInfoDisplay.moreInfoInfo = !controlInfoDisplay.moreInfoInfo
  if (controlInfoDisplay.moreInfoInfo) {
    controlInfoDisplay.moreLineInfo = undefined
  } else {
    controlInfoDisplay.moreLineInfo = 5
  }
}

function displayMoreAuthorInfo() {
  controlInfoDisplay.moreInfoAuthor = !controlInfoDisplay.moreInfoAuthor
  if (controlInfoDisplay.moreInfoAuthor) {
    controlInfoDisplay.moreLineAuthor = undefined
  } else {
    controlInfoDisplay.moreLineAuthor = 5
  }
}

function displayMoreDirectoryInfo() {
  controlInfoDisplay.moreInfoDirectory = !controlInfoDisplay.moreInfoDirectory
  if (controlInfoDisplay.moreInfoDirectory) {
    controlInfoDisplay.moreLineDirectory = undefined
  } else {
    controlInfoDisplay.moreLineDirectory = 5
  }
}

const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const alertError = (info) => {
  ElMessage.error(`${info}`)
}
const commentInfo = reactive([])
const commentEvent = () => {
  getBorrowInfoByUserAndBook(sessionStorage.getItem('userID'), route.params.id).then(res => {
    if(res.data.length){
      alertError("您已经评论过该书！")
    } else{
      dialogFormVisible.value = true
    }
  }).catch(err => {
    alertError(err)
  })
}
const dialogFormVisible = ref(false)
const myCommentInfo = reactive({
  content: "",
  score: 0,
  time: new Date(),
  userid: sessionStorage.getItem('userID'),
  bookid: route.params.id
})
const postCommentInfo = () => {
  if (!myCommentInfo.content) {
    alertError("评论内容不可为空，请输入评论内容")
  } else {
    postComment(myCommentInfo).then(() => {
      getCommentData(route.params.id)
      alertSuccess('评论成功')
    }).catch(err => {
      alertError(err)
    })
    let num = (bookDetailInfo.score * bookDetailInfo.score_number + myCommentInfo.score) / (bookDetailInfo.score_number + 1)
    bookDetailInfo.score = parseFloat(num.toFixed(1))
    bookDetailInfo.score_number += 1
    putBookInfo(route.params.id, bookDetailInfo).catch(err => {
      alertError(err)
    })
    dialogFormVisible.value = false
  }
}
const borrowInfoDetail = reactive({
  borrowtime: new Date(),
  returntime: null,
  userid: sessionStorage.getItem('userID'),
  bookid: route.params.id
})
const clickBorrowFun = () => {
  getBorrowInfoByUserAndBook(sessionStorage.getItem('userID'), route.params.id).then(res => {
    if (res.data.length) {
      alertError("您已经订阅过该书！")
    } else {
      postBorrowInfo(borrowInfoDetail).then(() => {
        alertSuccess("订阅成功！")
      }).catch(err => {
        alertError(err)
      })
    }
  }).catch(err => {
    alertError(err)
  })
}
</script>

<template>
  <div v-if="!load">
    <el-button type="primary" @click="goBack">返回</el-button>
    <div class="detail-container-all">
      <div class="detail-container">
        <el-image :src="getImgUrl(bookDetailInfo.picture)" class="el-image-detail" fit="fill"></el-image>
        <div class="Info-container">
          <div class="Info-detail">书名：{{ bookDetailInfo.title }}</div>
          <div class="Info-detail">作者：{{ bookDetailInfo.author }}</div>
          <div class="Info-detail">出版社：{{ bookDetailInfo.publish }}</div>
          <div class="Info-detail">
            <el-rate
                class="el-rate-detail"
                v-model="bookDetailInfo.score"
                disabled
                show-score
                text-color="#ff9900"
                :max=10
            />
          </div>
          <div class="Info-detail">{{ bookDetailInfo.score_number }}人参与评分</div>
        </div>
        <div class="el-button-book-detail-borrow">
          <el-button type="info" @click="clickBorrowFun">点击借阅</el-button>
        </div>
      </div>
      <div class="intro-info-container">
        <div class="info-intro-title">内容简介...</div>
        <div style="white-space: pre-wrap;">
          <el-text :line-clamp="controlInfoDisplay.moreLineInfo">{{ bookDetailInfo.intro }}</el-text>
        </div>
        <el-button class="detail-info-button" text @click="displayMoreInfo">
          <span v-if="controlInfoDisplay.moreInfoInfo">收起...</span>
          <span v-else>展开全部...</span>
        </el-button>
      </div>
      <div>
        <div class="info-intro-title">作者简介...</div>
        <div style="white-space: pre-wrap;">
          <el-text :line-clamp="controlInfoDisplay.moreLineAuthor">{{ bookDetailInfo.authorintro }}</el-text>
        </div>
        <el-button class="detail-info-button" text @click="displayMoreAuthorInfo">
          <span v-if="controlInfoDisplay.moreInfoAuthor">收起...</span>
          <span v-else>展开全部...</span>
        </el-button>
      </div>
      <div>
        <div class="info-intro-title">目录...</div>
        <div style="white-space: pre-wrap;">
          <el-text :line-clamp="controlInfoDisplay.moreLineDirectory">{{ bookDetailInfo.directory }}</el-text>
        </div>
        <el-button class="detail-info-button" text @click="displayMoreDirectoryInfo">
          <span v-if="controlInfoDisplay.moreInfoDirectory">收起...</span>
          <span v-else>展开全部...</span>
        </el-button>
      </div>
      <div class="comment-container">
        <div>
          <span class="info-intro-title">评论...</span>
          <el-button type="info" class="el-button-comment" @click="commentEvent">我要评论</el-button>
        </div>
        <div>
          <el-card class="comment-container-card" v-if="commentInfo.length" v-for="item in commentInfo">
            <div>
              <span style="margin-right: 50px;color: dodgerblue">{{ item.username }}</span>
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
            <div>
              {{ item.content }}
            </div>
          </el-card>
          <div v-else style="text-align: center">此书暂无评论信息</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>{{ load }}</div>
  <el-dialog v-model="dialogFormVisible" title="填写评价信息" width="500">
    <el-form :model="myCommentInfo">
      <el-form-item label="评分">
        <el-rate
            class="el-rate-detail"
            v-model="myCommentInfo.score"
            show-score
            text-color="#ff9900"
            :max=10
        />
      </el-form-item>
      <el-form-item label="评论内容">
        <el-input type="textarea" v-model="myCommentInfo.content"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="postCommentInfo">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-image-detail {
  width: 200px;
  height: 300px;
  float: left;
}

.Info-container {
  float: left;
  padding-left: 50px;
  font-size: 20px;
}


.Info-detail {
  padding-top: 15px;
}

.detail-container {
  height: 300px;
  margin-left: 100px;
}

.detail-container-all {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 400px;
  padding-right: 400px;
}

.info-intro-title {
  color: #44854d;
  padding-top: 20px;
  padding-bottom: 20px;
}

.detail-info-button {
  color: dodgerblue;
  float: right;
}

.intro-info-container {
  margin-top: 20px;
}

.el-button-comment {
  float: right;
  margin-right: 10px;
}

.comment-container {
  margin-top: 20px;
}

.comment-container-card {
  width: 100%;
  height: 100%;
  margin-top: 20px;
}

.el-button-book-detail-borrow {
  margin-top: 250px;
  position: relative;
  left: 100px;
}
</style>