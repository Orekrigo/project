import {createApp} from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import router from "./router/index.js"
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'
import moment from "moment";

const pinia = createPinia()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
Date.prototype.toISOString = function(){
    return moment(this).format('YYYY-MM-DD HH:mm:ss')
}
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount("#app")



