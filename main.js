import App from './App'

// ifndef 条件编译 主要是为了实现跨端兼容
// https://uniapp.dcloud.net.cn/tutorial/platform.html


// uniapp 现在默认是基于 vuejs2的
// ifndef = if not defined vue3 如果不是 vue3 就执行该代码

// #ifndef VUE3
import Vue from 'vue'

import uView from "uview-ui";
Vue.use(uView);


let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
import store from '@/store';


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用 vuejs 里面的插件的注册
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app);


// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)


app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif