<script setup>
import {useRoute} from "vue-router";
import {onMounted, reactive} from "vue";
import {getBookByClass} from "../../api/api.js";
import {useImgStore} from "../../store/imgFun.js";
import router from "../../router/index.js";

const route = useRoute()
const bookClassDetailInfo = reactive([])
const classification = route.query.classification
const store = useImgStore()
const {getImgUrl} = store
onMounted(() => {
  bookClassDetailInfo.length = 0
  getBookByClass(classification).then(res => {
    bookClassDetailInfo.push(...res.data.results)
  }).catch(err => {
    alert(err)
  })
  console.log(bookClassDetailInfo)
})
const clickButton = (id) => {
  router.push({name: 'bookDetail', params: {id: id}})
}
</script>

<template>
  <div class="class-detail-container">
    <h1>{{ classification }}类别的图书有：</h1>
    <el-card shadow="always" class="el-card-class-detail" v-for="item in bookClassDetailInfo" :key="item.id">
      <div class="card-content-class-detail">
        <el-image :src="getImgUrl(item.picture)" class="el-image-class-detail" fit="fill"></el-image>
        <div class="bookInfo-class-detail">
          <div class="title-class-detail">书名：{{ item.title }}</div>
          <div class="title-class-detail">作者：{{ item.author }}</div>
          <div class="title-class-detail">出版社：{{ item.publish }}</div>
          <div class="title-class-detail">
            <el-rate
                v-model="item.score"
                disabled
                show-score
                text-color="#ff9900"
                :max=10
            />
          </div>
          <div class="title-class-detail">{{ item.score_number }}人参与评分</div>
        </div>
        <div>
          <el-button type="info" @click="clickButton(item.id)">点击查看图书详情</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.el-card-class-detail {
  margin-bottom: 10px;
  margin-left: 10px;
  width: 800px;
  float: left;
}

.card-content-class-detail {
  padding-bottom: 10px;
}

.title-class-detail {
  padding-bottom: 10px;
  padding-left: 10px;
}

.bookInfo-class-detail {
  float: left;
}

.el-image-class-detail {
  width: 100px;
  height: 150px;
  float: left;
}
.class-detail-container{

}
</style>