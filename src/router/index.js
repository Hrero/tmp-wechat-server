import Vue from 'vue'
import Router from 'vue-router'

const layout = () => import('@/views/layout/layout');
const home = () => import('@/views/home/home');

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/', component: layout, children: [
                {
                    path: '', name: 'home', component: home, meta: { index: 0, title: '首页' }
                },
            ]
        },
        // 默认首页
        {
            path: "*",
            redirect: "/"
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0};
    }
})
