import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MarketBrowser from '../pages/MarketBrowser.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/market-browser',
    name: 'MarketBrowser',
    component: MarketBrowser,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
