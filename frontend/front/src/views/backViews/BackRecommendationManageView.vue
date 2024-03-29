<script setup>
import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {
  deleteRecommendInfo,
  getBookByTitle,
  getBookDetail,
  getRecommendByUser,
  getRecommendList,
  getUserIDDetail,
  getUsernameDetail, putRecommendInfo
} from "../../api/api.js";
import {ElMessage, ElMessageBox} from "element-plus";

const input = ref('')
const tableData = reactive([])
const tableNowData = reactive([])
const searchRecommendationData = reactive({
  current: 1,
  count: 50,
  pageSize: 10
})
const dialogFormVisible = ref(false)
const form = reactive({})
const newForm = reactive({})
const rules = reactive({
  username: [
    {required: true, message: '请输入内容', trigger: 'blur'}
  ],
  titles: [
    {required: true, message: '请输入内容', trigger: 'blur'}
  ]
})
const ruleFormRef = ref()
const alertSuccess = (info) => {
  ElMessage({
    message: `${info}`,
    type: 'success',
  })
}
const alertError = (info) => {
  ElMessage.error(`${info}`)
}
const getData = () => {
  searchRecommendationData.current = 1
  tableData.length = 0
  tableNowData.length = 0
  getRecommendList().then(res => {
    tableData.push(...res.data)
    changeIDToName()
    searchRecommendationData.count = res.data.length / 2
    tableNowData.push(...tableData.slice(0, searchRecommendationData.pageSize))
  }).catch(err => {
    alert(err)
  })
}
const changeIDToName = () => {
  let set = new Set()
  for (let i = 0; i < tableData.length; i++) {
    if (set.has(tableData[i].userid)) {
      tableData.splice(i, 1)
    } else {
      set.add(tableData[i].userid)
    }
  }
  set.clear()
  for (let i = 0; i < tableData.length; i++) {
    if (set.has(tableData[i].userid)) {
      tableData.splice(i, 1)
    } else {
      set.add(tableData[i].userid)
    }
  }
  for (let i = 0; i < tableData.length; i++) {
    tableData[i].titles = ''
    tableData[i].bookid = [...new Set(tableData[i].bookid.slice(1, tableData[i].bookid.length - 1).split(',').map(Number))]
    getUserIDDetail(tableData[i].userid).then(res => {
      tableData[i].username = res.data.username
    }).catch(err => {
      alertError(err)
    })
    for (let j = 0; j < tableData[i].bookid.length; j++) {
      if (tableData[i].bookid[j] === 0) {
        tableData[i].bookid[j] = 10
      }
      getBookDetail(tableData[i].bookid[j]).then(res => {
        tableData[i].titles += res.data.title + ';'
      }).catch(err => {
        alertError(err)
      })
    }
  }
}

onMounted(() => {
  getData()
})
const recommendationInfoEdit = (index, row) => {
  Object.assign(form, row)
  dialogFormVisible.value = true
}
const recommendationInfoDelete = (index, row) => {
  ElMessageBox.confirm(`确认删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    deleteRecommendInfo(row.id).then(() => {
      alertSuccess("删除成功！")
      getData()
    }).catch(err => {
      alertError(err)
    })
  })
}
const addRecommendation = () => {
  ElMessageBox.alert('所有的用户推荐信息皆在表中，若想更改点击编辑按钮即可，无需新增。', '提示', {
    confirmButtonText: '好的'
  })
}
const changeRecommendation = (val) => {
  searchRecommendationData.current = val
  let start = (val - 1) * searchRecommendationData.pageSize
  let end = val * searchRecommendationData.pageSize
  tableNowData.length = 0
  tableNowData.push(...tableData.slice(start, end))
}
const searchRecommendationInfo = () => {
  if (!input.value) {
    getData()
  } else {
    getUsernameDetail(input.value).then(res => {
      if (!res.data.length) {
        alertError('不存在此用户！')
      } else {
        getRecommendByUser(res.data[0].id).then(res => {
          alertSuccess("搜索成功！")
          tableData.length = 0
          tableNowData.length = 0
          searchRecommendationData.current = 1
          tableData.push(...res.data)
          changeIDToName()
          searchRecommendationData.count = res.data.length
          tableNowData.push(...tableData.slice(0, searchRecommendationData.pageSize))
        })
      }
    }).catch(err => {
      alertError(err)
    })
  }
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      newForm.bookid = ''
      getUsernameDetail(form.username).then(async res => {
        if (!res.data.length) {
          alertError("没有此用户！")
        } else {
          newForm.userid = form.userid
          let booksArr = form.titles.split(';')
          for (let i = 0; i < booksArr.length; i++) {
            if (booksArr[i]) {
              await getBookByTitle(booksArr[i]).then(res => {
                if (!res.data.results.length) {
                  alertError("有不存在的书名")
                  dialogFormVisible.value = false
                } else {
                  newForm.bookid += `${res.data.results[0].id}, `
                }
              })
            }
          }
          newForm.bookid = newForm.bookid.slice(0, -2)
          newForm.bookid = '[' + newForm.bookid + ']'
          console.log(newForm)
          putRecommendInfo(form.id, newForm).then(() => {
            alertSuccess('修改成功！')
            dialogFormVisible.value = false
            getData()
          }).catch(err => {
            alertError(err)
          })
        }
      })
    } else {
      alertError('信息输入格式错误！！！')
    }
  })
}
</script>

<template>
  <div>
    <el-divider/>
    <div>
      <el-button type="primary" @click="addRecommendation" class="recommendation-manage-top-left">新增+</el-button>
      <div class="recommendation-manage-top-middle">尽量不要修改图书推荐信息，因为系统后台每两小时根据用户行为更新一次。
      </div>
      <div class="recommendation-manage-top-right">
        <el-input
            v-model="input"
            style="width: 240px"
            size="default"
            placeholder="根据用户账号搜索"
            :prefix-icon="Search"
        />
        <el-button type="primary" style="margin-left: 10px" @click="searchRecommendationInfo">搜索</el-button>
      </div>
    </div>
    <el-card class="el-card-back-recommendation">
      <el-table :data="tableNowData" style="width: 100%" table-layout="auto">
        <el-table-column label="用户账号" prop="username"/>
        <el-table-column label="推荐书名" prop="titles"/>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="default" @click="recommendationInfoEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="default"
                type="danger"
                @click="recommendationInfoDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="searchRecommendationData.current" class="el-pagination-back-recommendation"
                     background
                     layout="prev, pager, next"
                     :total="searchRecommendationData.count" :page-size="searchRecommendationData.pageSize"
                     @current-change="changeRecommendation"/>
    </el-card>
  </div>
  <el-dialog v-model="dialogFormVisible" title="请输入推荐信息" destroy-on-close
             class="el-dialog-recommendation-back">
    <el-form :model="form" status-icon :rules="rules" ref="ruleFormRef">
      <el-form-item label="用户账号" class="el-form-item-recommendation-back" prop="username" label-width="80px">
        <el-input v-model="form.username" type="text" maxlength="32"/>
      </el-form-item>
      <el-form-item label="推荐书名" class="el-form-item-recommendation-back" prop="titles" label-width="80px">
        <el-input v-model="form.titles" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

.recommendation-manage-top-left {
  float: left;
}

.recommendation-manage-top-middle {
  float: left;
  margin-left: 220px;
  margin-top: 10px;
  color: chocolate;
}

.recommendation-manage-top-right {
  float: right;
  margin-right: 50px;
}

.el-card-back-recommendation {
  margin-top: 100px;
}

.el-pagination-back-recommendation {
  margin-top: 20px;
  float: right;
  margin-bottom: 20px;
}

.el-form-item-recommendation-back {
  text-align: center;
  align-items: center;
}

.el-dialog-recommendation-back {
  background-color: #44854d;
}
</style>