<script setup>
import {onMounted, reactive, ref} from "vue";
import {getBookDetail, getRecommendByUser} from "../../api/api.js";
import {useImgStore} from "../../store/imgFun.js";
import router from "../../router/index.js";

const store = useImgStore()
const {getImgUrl} = store
const bookIdsOld = reactive([])
const bookIdsNew = reactive([])
const allBook = reactive([])
const haveData = ref(true)
onMounted(() => {
  allBook.length = 0
  bookIdsNew.length = 0
  bookIdsOld.length = 0
  getRecommendByUser(sessionStorage.getItem('userID')).then(res => {
    if (res.data.length) {
      let len = res.data[0].bookid.length
      bookIdsOld.push(...res.data[0].bookid.slice(1, len - 1).split(','))
      bookIdsNew.push(...new Set(bookIdsOld.map(Number)))
      getMyBookAll()
    } else {
      haveData.value = false
    }
  }).catch(err => {
    console.log(err)
  })
})
const getMyBookAll = () => {
  for (let i = 0; i < bookIdsNew.length; i++) {
    getBookDetail(bookIdsNew[i]).then(res => {
      allBook.push(res.data)
    }).catch(err => {
      console.log(err)
    })
  }
}
const clickButton = (id) => {
  router.push({name: 'bookDetail', params: {id: id}})
}
</script>

<template>
  <div class="flex flex-wrap gap-4" v-if="haveData">
    <h1 style="margin-left: 400px">为您推荐：</h1>
    <el-card shadow="always" class="el-card-recommendation" v-for="item in allBook" :key="item.id">
      <div class="card-content-recommendation">
        <el-image :src="getImgUrl(item.picture)" class="el-image-recommendation" fit="fill"></el-image>
        <div class="bookInfo-recommendation">
          <div class="title-recommendation">书名：{{ item.title }}</div>
          <div class="title-recommendation">作者：{{ item.author }}</div>
          <div class="title-recommendation">出版社：{{ item.publish }}</div>
          <div class="title-recommendation">
            <el-rate
                v-model="item.score"
                disabled
                show-score
                text-color="#ff9900"
                :max=10
            />
          </div>
          <div class="title-recommendation">{{ item.score_number }}人参与评分</div>
        </div>
        <div>
          <el-button type="info" @click="clickButton(item.id)">点击查看图书详情</el-button>
        </div>
      </div>
    </el-card>
  </div>
  <div v-else style="text-align: center;margin-top: 100px">系统后台正在为您计算推荐...</div>
</template>

<style scoped>
.el-card-recommendation {
  margin-right: 400px;
  margin-left: 400px;
  margin-bottom: 10px;
}

.card-content-recommendation {
  padding-left: 50px;
  padding-bottom: 10px;
}

.title-recommendation {
  padding-bottom: 10px;
  padding-left: 10px;
}

.bookInfo-recommendation {
  float: left;
}

.el-image-recommendation {
  width: 100px;
  height: 150px;
  float: left;
}
</style>