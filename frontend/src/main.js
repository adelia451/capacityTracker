import { createApp } from 'vue'
import { createPinia } from 'pinia' // Pinia = Vue's state management (shared data stores)
import './style.css'
import App from './App.vue'
import router from './router' // resolves to ./router/index.js automatically

// Vue app instance from root component
const app = createApp(App) 

// REGISTERING
app.use(createPinia()) // must happen before any store is used
app.use(router)        // enables <RouterView> and <RouterLink>

app.mount('#app') // attach the app to the <div id="app"> in index.html

