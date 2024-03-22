<script setup>
import {onMounted, onUnmounted, reactive} from "vue";
import {deleteBorrowInfo, getBookDetail, getBorrowListByUser, putBorrowInfo} from "../../api/api.js";
import {ElMessage} from "element-plus";
import {useImgStore} from "../../store/imgFun.js";
import router from "../../router/index.js";
import moment from "moment";

const store = useImgStore()
const {getImgUrl} = store
const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const alertError = (info) => {
  ElMessage.error(`${info}`)
}
const borrowRecordInfo = reactive({
  borrowtime: new Date(),
  returntime: new Date(),
  userid: sessionStorage.getItem('userID'),
  bookid: 0
})
const getBorrowData = () => {
  getBorrowListByUser(sessionStorage.getItem('userID')).then(res => {
    borrowRecordsInfoDisplay.length = 0
    borrowRecordsInfoDisplay.push(...res.data)
    for (let item of borrowRecordsInfoDisplay) {
      getBookDetail(item.bookid).then(res => {
        delete res.data.id
        Object.assign(item, res.data)
      })
      item.borrowtime = moment(item.borrowtime).format('YYYY-MM-DD HH:mm:ss');
      if (item.returntime !== null) {
        item.returntime = moment(item.returntime).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }).catch(err => {
    alertError(err)
  })
}
const borrowRecordsInfoDisplay = reactive([])
let setIntervalFun = setInterval(() => {
  borrowRecordInfo.returntime = moment(borrowRecordInfo.returntime).format('YYYY-MM-DD HH:mm:ss');
}, 1000)
onMounted(() => {
  getBorrowData()
})
onUnmounted(() => {
  clearInterval(setIntervalFun)
})
const returnBookFun = (item) => {
  borrowRecordInfo.borrowtime = item.borrowtime
  borrowRecordInfo.bookid = item.bookid
  putBorrowInfo(item.id, borrowRecordInfo).then(() => {
    alertSuccess("取消成功")
  }).catch(err => {
    alertError(err)
  })
  router.go(0)
}
const deleteBorrowInfoFun = (id) => {
  deleteBorrowInfo(id).then(() => {
    alertSuccess("删除成功")
  }).catch(err => {
    alertError(err)
  })
  router.go(0)
}
</script>

<template>
  <div class="root-borrow-records">
    <div class="borrow-records-container">
      <h2>借阅记录：</h2>
      <div>您共有{{ borrowRecordsInfoDisplay.length }}条借阅记录</div>
      <div>
        <el-card class="borrow-records-container-card" v-if="borrowRecordsInfoDisplay.length"
                 v-for="item in borrowRecordsInfoDisplay" :key="item.id">
          <el-image :src="getImgUrl(item.picture)" class="el-image-borrow-records" fit="fill"></el-image>
          <div style="margin-left: 150px">
            <div style="margin-bottom: 5px;color: dodgerblue"> {{ item.title }}</div>
            <div>作者：{{ item.author }}</div>
            <div>
              <el-rate
                  class="el-rate-detail"
                  v-model="item.score"
                  disabled
                  show-score
                  text-color="#ff9900"
                  :max=10
              />
            </div>
            <el-text style="margin-bottom: 5px" v-if="item.returntime === null" type="success">状态：借阅中</el-text>
            <el-text style="margin-bottom: 5px" v-else type="warning">状态：已归还</el-text>
            <div style="color: #aaaaaa;margin-bottom: 5px;margin-top: 5px">借阅时间：{{ item.borrowtime }}</div>
            <div style="color: #aaaaaa" v-show="item.returntime">归还时间：{{ item.returntime }}</div>
          </div>
          <div class="button-borrow-records-container">
            <el-button type="warning" @click="returnBookFun(item)" :disabled="item.returntime !== null">取消借阅
            </el-button>
            <el-button type="danger" @click="deleteBorrowInfoFun(item.id)" :disabled="item.returntime === null">删除记录
            </el-button>
          </div>
        </el-card>
        <div v-else style="text-align: center">您还没有借阅过</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.borrow-records-container {
  margin-top: 20px;
}

.borrow-records-container-card {
  width: 100%;
  height: 100%;
  margin-top: 20px;
}

.root-borrow-records {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 400px;
  padding-right: 400px;
}

.button-borrow-records-container {
  display: flex;
  justify-content: right;
}

.el-image-borrow-records {
  width: 100px;
  height: 150px;
  float: left;
}
</style>