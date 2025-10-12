import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()
// vue 全家桶到齐
createApp(App).use(router).use(pinia).mount('#app')
