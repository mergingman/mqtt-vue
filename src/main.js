import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import mqttVueHook from 'mqtt-vue-hook'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(mqttVueHook, `ws://broker.mqttdashboard.com:8000/mqtt`, {
//     clean: false,
//     keepalive: 60,
//     clientId: `mqtt_client_${Math.random().toString(16).substring(2, 10)}`,
//     connectTimeout: 4000,
// })

app.mount('#app')
