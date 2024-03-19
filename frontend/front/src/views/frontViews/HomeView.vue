<script setup>
import {getBookList} from "../../api/api.js";
import {onMounted, reactive, ref} from "vue";
import {useImgStore} from "../../store/imgFun.js";
import router from "../../router/index.js";

let bookList = reactive([])
const searchData = reactive({
  current: 1,
  count: 50,
  pageSize: 5
})
let load = ref()
const getAllBook = (val) => {
  getBookList(val).then(res => {
    bookList.length = 0
    bookList.push(...res.data.results)
    searchData.count = res.data.count
  }).catch(error => {
    load.value = error
  })
  searchData.current = val
}
onMounted(() => {
  getAllBook(1)
})

const store = useImgStore()
const {getImgUrl} = store
// const getImgUrl = file => {
//   return new URL(`../assets/img/${file}`, import.meta.url).href;
// }
const clickButton = (id) => {
  router.push({name: 'bookDetail', params: {id: id}})
}
</script>

<template>
  <div class="flex flex-wrap gap-4" v-if="!load">
    <el-card shadow="always" class="el-card-home" v-for="item in bookList" :key="item.id">
      <div class="card-content-home">
        <el-image :src="getImgUrl(item.picture)" class="el-image-home" fit="fill"></el-image>
        <div class="bookInfo-home">
          <div class="title-home">书名：{{ item.title }}</div>
          <div class="title-home">作者：{{ item.author }}</div>
          <div class="title-home">出版社：{{ item.publish }}</div>
          <div class="title-home">
            <el-rate
                v-model="item.score"
                disabled
                show-score
                text-color="#ff9900"
                :max=10
            />
          </div>
          <div class="title-home">{{ item.score_number }}人参与评分</div>
        </div>
        <div>
          <el-button type="info" @click="clickButton(item.id)">点击查看图书详情</el-button>
        </div>
      </div>
    </el-card>
    <el-pagination :current-page="searchData.current" class="el-pagination-home" background layout="prev, pager, next"
                   :total="searchData.count" :page-size="searchData.pageSize" @current-change="getAllBook"/>
  </div>
  <div v-else>{{ load }}</div>
</template>

<style scoped>
.el-card-home {
  margin-right: 200px;
  margin-left: 200px;
  margin-bottom: 10px;
}

.card-content-home {
  padding-left: 300px;
  padding-bottom: 10px;
}

.el-pagination-home {
  margin-left: 100px;
}

.title-home {
  padding-bottom: 10px;
  padding-left: 10px;
}

.bookInfo-home {
  float: left;
}

.el-image-home {
  width: 100px;
  height: 150px;
  float: left;
}
</style>