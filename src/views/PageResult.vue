<template>
  <el-container class="documentIpt_all">
    <el-header class="documentIpt_header" height="250px">
      <p>{{ store.text }}</p>
      <el-breadcrumb class="p_bottom" separator=">>">
        <el-breadcrumb-item :to="{ path: '/' }">HOME</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/page2' }">AUTOMATIC-QUESTION</el-breadcrumb-item>
        <el-breadcrumb-item>SHOW-QUESTION</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="documentIpt_main">
    <p class="topic">题目展示</p>
      <div class="content" v-if="responseContent.length > 0">
<!--        <p class="content" v-for="(line, index) in responseContent" :key="index">{{line }}</p>-->
        <p v-for="(line, index) in responseContent" :key="index">
          {{ line }}<br>
        </p>
      </div>

    </el-main>
    <el-footer class="documentIpt_footer">
      <el-button size="large" type="primary" class="documentIpt_btn" @click="downloadJson" >下载文档</el-button>
      <el-button size="large" type="primary" class="documentIpt_btn" @click="goToDocumentIptPage">返回</el-button>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import {onMounted, ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import {Document, UploadFilled} from "@element-plus/icons-vue";
import DocumentIpt from "@/views/DocumentIpt.vue";


export default {
  name: 'pageResult',
  components: {Document, UploadFilled},
  setup() {
    const { useStore } = require('../store/index.js')
    const store = useStore()
    const router = useRouter()

    //返回上层
    const goToDocumentIptPage=function (){
      router.push({
        name:'Page2'
      })
    }

    const route = useRoute();
    const jsonData = ref('');
    const responseContent = ref<string[]>([]);

    onMounted(() => {
      // 从路由查询参数中获取JSON数据并确保它是字符串类型
      const data = route.query.jsonData;
      console.log('ok')
      console.log('data---',data)
      // if (typeof data === 'string') {
      //   jsonData.value = data;
      //
      //   try {
      //     const obj = JSON.parse(data);
      //
      //     // const obj1=obj.data;
      //
      //     // 假设我们想要显示对象中的前五行属性
      //     responseContent.value = Object.keys(obj).slice(0, 1).map(key => obj[key]) ;
      //     responseContent.value =responseContent.value[0].split('\n');
      //     console.log( responseContent.value );
      //     // console.log( responseContent.length);
      //
      //   } catch (e) {
      //     responseContent.value = ['Invalid JSON data'];
      //   }
      //
      // } else if (Array.isArray(data)) {
      //   // 如果是数组，假设我们只需要第一个元素
      //   jsonData.value = data[0] as string;
      // }
    });

    const downloadJson = () => {
      // 将JSON数据转换为Blob对象
      const blob = new Blob([jsonData.value], { type: 'application/json' });

      // 创建一个URL指向该Blob对象
      const url = URL.createObjectURL(blob);

      // 创建一个<a>标签并模拟点击以下载文件
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json'; // 设置下载的文件名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 释放URL对象
      URL.revokeObjectURL(url);}



    return {
      // upload,
      store,
      goToDocumentIptPage,
      downloadJson,
      responseContent
    }
  }
}
</script>

<style lang="less" scoped>
.documentIpt_all{
  background-image: url(../assets/知识图谱图片2.png);
  background-size: cover;
}
.documentIpt_header {
  padding: 0;
  //background-image: url(../assets/课程知识图谱图片3.png);
  background-size: cover;
  position: relative;
  p {
    position: absolute;
    top: 60px;
    left: 620px;
    color: #ffffff;
    font-weight: 700;
    font-size: 74px;
  }
  .p_bottom {
    position: absolute;
    top: 170px;
    left: 605px;
    /deep/ .el-breadcrumb__item > span {
      color: #ffffff;
      font-size: 15px;
      font-weight: normal;
    }
  }
}
.documentIpt_main {

  padding: 0;
  height: 350px;
  position: relative;

  .topic{
    position: absolute;
    //top: 60px;
    left:190px;
    color:white;
    font-weight: 700;
    font-size:44px;
  }
  .content {
    position: absolute;
    //top: 60px;
    left:400px;
    right: 200px;
    color:black;
    font-weight: 700;
    font-size:22px;
    background-color:papayawhip ;

  //不适用于所有浏览器
  //  display: -webkit-box;
  //  -webkit-box-orient: vertical;
  //  -webkit-line-clamp: 10; /* 限制为100行 */
  //  overflow: hidden;
  //  text-overflow: ellipsis;

  }
  //div{
  //  position: absolute;
  //  width: 630px;
  //  height: 220px;
  //  left:550px;
  //  background-color: papayawhip;
  //}
}
.documentIpt_footer {
  margin-left: 580px;

  .documentIpt_btn {
    margin-right: 100px;
    width: 100px;
    height: 50px;
    background-color: #b49c73;
    border-color: #b49c73;
    color: black;
    font-size: 20px;
    font-weight: 800;
  }
}
</style>
