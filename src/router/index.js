import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
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
    history: createWebHashHistory('/vue-minecraft/'),
    mode:'hash',
    routes,
})
export default router
