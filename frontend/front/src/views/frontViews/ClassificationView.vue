<script setup>
import {onMounted, reactive} from "vue";
import {getBookList} from "../../api/api.js";
import router from "../../router/index.js";

const bookClass = reactive(new Set())
onMounted(() => {
  bookClass.clear()
  for (let i = 1; i <= 10; i++) {
    getBookList(i).then(res => {
      for (let i = 0; i < 5; i++) {
        bookClass.add(res.data.results[i].classification)
      }
    })
  }
})
const clickButtonClass = (item) => {
  router.push({name: "classDetail", query: {classification: item}})
}
</script>

<template>
  <div class="classification-container">
    <h1>目前拥有类别:(点击查看)</h1>
    <div v-for="item in bookClass" class="route-classification">
      <el-button type="info" @click="clickButtonClass(item)">{{ item }}</el-button>
    </div>
  </div>
</template>

<style scoped>
.classification-container {
  margin-left: 500px;
  margin-right: 500px;
}

.route-classification {
  margin-right: 30px;
  margin-top: 20px;
  float: left;
  width: 90px;
}
</style>