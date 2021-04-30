import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './../views/Home.vue'
import World from './../views/World.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/play',
        name: 'Play',
        component: World,
    },
]
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    mode:'hash',
    routes,
})
export default router
