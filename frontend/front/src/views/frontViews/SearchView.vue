<script setup>
import {Search} from '@element-plus/icons-vue'
import {reactive, ref} from "vue";
import {useImgStore} from "../../store/imgFun.js";
import {getBookByAuthor, getBookByPublish, getBookByTitle} from "../../api/api.js";
import {ElMessage} from "element-plus";
import router from "../../router/index.js";

const store = useImgStore()
const {getImgUrl} = store
const inputValue = ref('')
const select = ref('1')
const searchBookList = reactive([])
const searchYesOrNo = ref(true)
const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const alertError = (info) => {
  ElMessage.error(`${info}`)
}
const searchBookInfo = () => {
  if (!inputValue.value) {
    alertError("输入不能空")
    return
  }
  if (select.value === '1') {
    getBookByTitle(inputValue.value).then(res => {
      alertSuccess("搜索成功！")
      searchBookList.length = 0
      searchBookList.push(...res.data.results)
      searchYesOrNo.value = Boolean(res.data.results.length);
    }).catch(err => {
      alertError(err)
    })
  } else if (select.value === '2') {
    getBookByAuthor(inputValue.value).then(res => {
      alertSuccess("搜索成功！")
      searchBookList.length = 0
      searchBookList.push(...res.data.results)
      searchYesOrNo.value = Boolean(res.data.results.length);
    }).catch(err => {
      alertError(err)
    })
  } else {
    getBookByPublish(inputValue.value).then(res => {
      alertSuccess("搜索成功！")
      searchBookList.length = 0
      searchBookList.push(...res.data.results)
      searchYesOrNo.value = Boolean(res.data.results.length);
    }).catch(err => {
      alertError(err)
    })
  }
}
const clickButton = (id) => {
  router.push({name: 'bookDetail', params: {id: id}})
}
</script>

<template>
  <div>
    <div class="mt-4 search-container">
      <el-input
          v-model="inputValue"
          style="width: 800px"
          placeholder="请输入"
          class="input-with-select"
      >
        <template #prepend>
          <el-select v-model="select" placeholder="Select" style="width: 115px">
            <el-option label="书名" value="1"/>
            <el-option label="作者" value="2"/>
            <el-option label="出版社" value="3"/>
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" @click="searchBookInfo"/>
        </template>
      </el-input>
    </div>
    <div v-if="searchYesOrNo" class="el-card-search-container">
      <el-card shadow="always" class="el-card-search" v-for="item in searchBookList" :key="item.id">
        <div class="card-content-search">
          <el-image :src="getImgUrl(item.picture)" class="el-image-search" fit="fill"></el-image>
          <div class="bookInfo-search">
            <div class="title-search">书名：{{ item.title }}</div>
            <div class="title-search">作者：{{ item.author }}</div>
            <div class="title-search">出版社：{{ item.publish }}</div>
            <div class="title-search">
              <el-rate
                  v-model="item.score"
                  disabled
                  show-score
                  text-color="#ff9900"
                  :max=10
              />
            </div>
            <div class="title-search">{{ item.score_number }}人参与评分</div>
          </div>
          <div>
            <el-button type="info" @click="clickButton(item.id)">点击查看图书详情</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div v-else class="search-no-info">未找到相关信息</div>
  </div>
</template>

<style scoped>
.search-container {
  text-align: center;
}

.search-no-info {
  text-align: center;
  margin-top: 50px;
}

.el-card-search {
  margin-right: 200px;
  margin-left: 200px;
  margin-bottom: 10px;
}

.card-content-search {
  padding-left: 300px;
  padding-bottom: 10px;
}

.title-search {
  padding-bottom: 10px;
  padding-left: 10px;
}

.bookInfo-search {
  float: left;
}

.el-image-search {
  width: 100px;
  height: 150px;
  float: left;
}

.el-card-search-container {
  margin-top: 50px;
}
</style>