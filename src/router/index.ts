import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Navigation from '../views/Navigation.vue'
import Home from '../views/Home.vue'

import DocumentIpt from '../views/DocumentIpt.vue'

import ShowDocument from '../views/ShowDocument.vue'

import { close, start } from '@/nprogress/nprogress'

import DisplayGraph1 from "@/views/DisplayGraph1.vue";

import page2 from "@/views/Page2.vue";
import PageResult from "@/views/PageResult.vue";

import zujuan from "@/views/zujuan.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/navigation/home'
  },
  {
    path: '/navigation',
    name: 'Navigation',
    component: Navigation,
    children: [
      //主页
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      //文档上传
      {
        path: 'documentIpt',
        name: 'DocumentIpt',
        component: DocumentIpt
      },

      //知识点展示
      {
        path:'showDocument',
        name:'ShowDocument',
        component:ShowDocument
      },

      //知识图谱展示
      {
        path:'displayGraph1',
        name:'DisplayGraph1',
        component:DisplayGraph1

      },
      //出题
      {
        path:'page2',
        name:'page2',
        component:page2
      },

      {
        path:'pageResult',
        name:'pageResult',
        component:PageResult
      },
      {
        path:'zujuan',
        name:'zujuan',
        component:zujuan
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((pre, next) => {
  start()
})

router.afterEach(() => {
  close()
})
export default router
