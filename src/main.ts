import { createApp } from 'vue'

import { setupStore } from '@/store'

import App from './App.vue'
import 'uno.css'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)

  app.mount('#app')
}

bootstrap()
