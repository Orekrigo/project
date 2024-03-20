<script setup>
import {onMounted, reactive} from "vue";
import {getBookAllList} from "../../api/api.js";
import router from "../../router/index.js";

const bookClass = reactive(new Set())
onMounted(() => {
  bookClass.clear()
  getBookAllList().then(res => {
    console.log(res.data)
    for (let i = 0; i < res.data.length; i++) {
      bookClass.add(res.data[i].classification)
    }
  })
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