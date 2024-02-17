import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@arco-design/web-vue/dist/arco.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue';
import {createVfm} from "vue-final-modal";

const app = createApp(App)
const vfm = createVfm()

app.use(router)
app.use(ArcoVue)
app.use(vfm)
app.mount('#app')