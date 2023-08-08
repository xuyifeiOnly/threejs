import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Loading from './components/loading.vue'

import './assets/main.css'

const app = createApp(App)
app.component('Loading', Loading)
app.use(createPinia())
app.use(router)

app.mount('#app')
