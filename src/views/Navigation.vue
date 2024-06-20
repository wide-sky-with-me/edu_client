<template>
  <el-container  >
    <el-header class="home_first_header" height="70px">
      <div class="left">教培大模型“子路”</div>
      <div class="right">
        <el-menu :default-active="activeIndex" class="home_menu" mode="horizontal" @select="handleSelect" active-text-color="#b49c73">
          <el-menu-item index="1" @click="toHome">首页</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-main class="home_first_main">
      <router-view></router-view>
    </el-main>

  </el-container>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import Footer from "@/views/ Footer.vue";
import {Iphone, Notebook} from "@element-plus/icons-vue";


export default {
  name: 'Navigation',
  components: { Iphone, Notebook},
  // Footer},
  setup() {
    const router = useRouter()
    const { useStore } = require('../store/index.js')
    const store = useStore()

    const size = 20
    const color = '#b49c73'
    // 导航栏默认激活项
    const activeIndex = ref('1')
    // 导航栏切换以后触发的方法
    const handleSelect = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    // 跳转首页
    const toHome = function () {
      store.text = '课程知识图谱'
      router.push({
        name: 'Home'
      })
    }

    return {
      activeIndex,
      handleSelect,
      size,
      color,
      toHome,
      store,

    }
  }
}
</script>

<style scoped lang="less">
.home_first_header {
  padding: 0;
  .left {
    width: 35%;
    height: 100%;
    float: left;
    background-color:wheat;
    color: #37373f;
    font-size: 54px;
    font-weight: 500;
    text-align: center;
    line-height: 80px;
  }
  .right {
    float: left;
    width: 65%;
    .right_outter {
      height: 50px;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      .inner_left {
        width: 50%;
        span {
          line-height: 45px;
          text-align: center;
          margin-left: 30px;
          .icon {
            top: 3px;
          }
        }
      }
      .inner_right {
        width: 50%;
        padding-left: 350px;
        line-height: 45px;
        margin-left: auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
    }
    .home_menu {
      height: 70px;
      font-size: 20px;
      .btn_menu {
        margin-left: 650px;
        margin-top: 23px;
        font-size: 15px;
        font-weight: 700;
        height: 50px;
        width: 85px;
        background-color: #b49c73;
        color: black;
      }
      .btn_menu:hover {
        color: white;
        background-color: #a78a5a;
      }
    }
  }
}
.home_first_main {
  padding: 0;
}
.inner_right img{
  width: 3em; /* 设置图片宽度为相对于父元素字体大小的单位 */
  height: 3em; /* 设置图片高度为相对于父元素字体大小的单位 */

}


</style>
