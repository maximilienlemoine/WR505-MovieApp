import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/movies',
            name: 'movies',
            component: () => import('../views/MoviesView.vue')
        },
        {
            path: '/actors',
            name: 'actors',
            component: () => import('../views/ActorsView.vue')
        },
        {
            path: '/actor/:id/detail',
            name: 'detailActor',
            component: () => import('../components/DetailActor.vue')
        },
        {
            path: '/categories',
            name: 'categories',
            component: () => import('../views/CategoriesView.vue')
        },
        {
            path: '/movie/:id/detail',
            name: 'detailMovie',
            component: () => import('../components/DetailMovie.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue')
        },
        {
            path: '/actor/create',
            name: 'createActor',
            component: () => import('../components/CreateActor.vue')
        },
        {
            path: '/movie/create',
            name: 'createMovie',
            component: () => import('../components/CreateMovie.vue')
        },
        {
            path: '/forgot-password',
            name: 'forgotPassword',
            component: () => import('../views/Password/ForgotPasswordView.vue')
        },
        {
            path: '/reset-password/:token',
            name: 'resetPassword',
            component: () => import('../views/Password/ResetPasswordView.vue')
        }
    ]
})

export default router
