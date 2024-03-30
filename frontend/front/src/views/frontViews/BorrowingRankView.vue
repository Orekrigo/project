<script setup>
import {onMounted, reactive} from "vue";
import {useImgStore} from "../../store/imgFun.js";
import {getAllBorrowInfo, getBookDetail} from "../../api/api.js";
import router from "../../router/index.js";

const store = useImgStore()
const {getImgUrl} = store
const count = reactive({})
const allBorrowInfo = reactive([])
const uniqueArray = reactive([])
onMounted(() => {
  getAllBorrowInfo().then(res => {
    allBorrowInfo.length = 0
    for (let item of res.data) {
      delete item.id
      delete item.borrowtime
      delete item.returntime
      delete item.userid
      count[item.bookid] = 0
    }
    for (let item of res.data) {
      count[item.bookid] += 1
      allBorrowInfo.push(item)
    }
    uniqueArray.push(...[...new Set(allBorrowInfo.map(JSON.stringify))].map(JSON.parse))
    for (let item of uniqueArray) {
      item.sum = count[item.bookid]
    }
    uniqueArray.sort((a, b) => b.sum - a.sum)
    for (let item of uniqueArray) {
      getBookDetail(item.bookid).then(res => {
        item.id = res.data.id
        item.title = res.data.title
        item.author = res.data.author
        item.publish = res.data.publish
        item.picture = res.data.picture
        item.score_number = res.data.score_number
        item.score = res.data.score
      }).catch(err => {
        alert(err)
      })
    }
    console.log(uniqueArray)
  }).catch(err => {
    alert(err)
  })
})
const clickButton = (id) => {
  router.push({name: 'bookDetail', params: {id: id}})
}
</script>

<template>
  <div class="flex flex-wrap gap-4" v-if="allBorrowInfo.length">
    <h1 style="margin-left: 400px">图书借阅排行榜：</h1>
    <el-card shadow="always" class="el-card-borrow-rank" v-for="item in uniqueArray" :key="item.id">
      <div class="card-content-borrow-rank">
        <div style="margin-bottom: 10px;color: #0b1dee">借阅次数：{{ item.sum }}</div>
        <el-image :src="getImgUrl(item.picture)" class="el-image-borrow-rank" fit="fill"></el-image>
        <div class="bookInfo-borrow-rank">
          <div class="title-borrow-rank">书名：{{ item.title }}</div>
          <div class="title-borrow-rank">作者：{{ item.author }}</div>
          <div class="title-borrow-rank">出版社：{{ item.publish }}</div>
          <div class="title-borrow-rank">
            <el-rate
                v-model="item.score"
                disabled
                show-score
                text-color="#ff9900"
                :max=10
            />
          </div>
          <div class="title-borrow-rank">{{ item.score_number }}人参与评分</div>
        </div>
        <div>
          <el-button type="info" @click="clickButton(item.id)">点击查看图书详情</el-button>
        </div>
      </div>
    </el-card>
  </div>
  <div v-else style="text-align: center;margin-top: 100px">目前没有借阅信息</div>
</template>

<style scoped>
.el-card-borrow-rank {
  margin-right: 400px;
  margin-left: 400px;
  margin-bottom: 10px;
}

.card-content-borrow-rank {
  padding-left: 50px;
  padding-bottom: 10px;
}

.title-borrow-rank {
  padding-bottom: 10px;
  padding-left: 10px;
}

.bookInfo-borrow-rank {
  float: left;
}

.el-image-borrow-rank {
  width: 100px;
  height: 150px;
  float: left;
}
</style>