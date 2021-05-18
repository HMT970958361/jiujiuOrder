import Vue from 'vue'
import App from './App'
import store from './store/index.js'

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

console.log('当前环境:',uni.getSystemInfoSync().platform)
if (uni.getSystemInfoSync().platform !== "devtools") {//在非生产环境中，让consloe.log为空函数，仅消耗0.005ms
	console.log = () => {}
}

const app = new Vue({
	store,
    ...App
})
app.$mount()
