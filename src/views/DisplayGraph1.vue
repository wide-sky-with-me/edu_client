<template>
  <el-container class="documentIpt_all">
    <el-header
      class="documentIpt_header"
      height="200px">
      <p>{{ store.text }}</p>
      <el-breadcrumb
        class="p_bottom"
        separator=">>">
        <el-breadcrumb-item :to="{ path: '/' }">HOME</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'documentIpt' }">FILE-UPLOAD</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'showDocument' }">FILE-PREVIEW</el-breadcrumb-item>
        <el-breadcrumb-item>DISPLAY-GRAPH</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="documentIpt_main">
      <div class="content_container">
        <div
          class="content"
          ref="chartContainer">
          <div class="reload-container">
            <img
              v-if="!showReloadButton"
              src="../assets/loading.gif"
              alt="加载中"
              class="reload-image" />
            <p v-if="!showReloadButton">拼命加载中。。。</p>
            <img
              v-if="showReloadButton"
              src="../assets/rerun.gif"
              alt="重新加载"
              class="reload-image" />
            <a
              v-if="showReloadButton"
              @click="reloadChart"
              class="reload-link"
              >加载失败，点击重新加载</a
            >
          </div>
        </div>
      </div>

      <!--      <div style="margin-bottom:100px;background-color: red;width: 900px;height: 900px ">-->
      <!--        &lt;!&ndash; 假设我们有一个按钮来触发发送数据和显示词云 &ndash;&gt;-->
      <!--        <button @click="generateWordCloud">生成词云</button>-->
      <!--        &lt;!&ndash; 用于显示词云的图片元素 &ndash;&gt;-->
      <!--        <img v-if="wordcloudUrl" :src="wordcloudUrl" alt="Word Cloud" />-->
      <!--      </div>-->

      <div class="buttons-container">
        <el-button
          size="large"
          type="primary"
          class="documentIpt_btn"
          @click="downloadImage"
          >下载图谱</el-button
        >
        <el-button
          size="large"
          type="primary"
          class="documentIpt_btn"
          @click="goToDocumentIptPage"
          >返回</el-button
        >
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { computed, onMounted, reactive, Ref, ref, watch } from "vue";
// import { genFileId } from 'element-plus'
// import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { useRouter, useRoute } from "vue-router";
import { Document, UploadFilled } from "@element-plus/icons-vue";
// import Neovis from "neovis.js";
// import DocumentIpt from "@/views/DocumentIpt.vue";
import * as echarts from "echarts";
// import data from '../assets/js/result_auto.json'
import { ElMessage } from "element-plus";
import axios from "axios";

const neo4j = require("neo4j-driver");

//知识点内容
interface Con {
  point: string;
  text: string;
}
//章节
interface Chapter {
  content: Con[];
  title: string;
}

// 定义 jsonData 的类型
type JsonData = Chapter[];
export default {
  name: "DisplayGraph",
  components: { Document, UploadFilled },
  setup() {
    const { useStore } = require("../store/index.js");
    const store = useStore();
    const router = useRouter();
    const goToDocumentIptPage = function () {
      router.push({
        name: "Home",
      });
    };

    // 定义响应式状态
    const echartsData = ref<[]>([]); // 用于存储处理后的数据
    const nodesRelation = ref<any[]>([]); // 关系线数据
    const category = ref<any[]>([]); // 图例数据
    const records = ref<any[]>([]); // 存储查询结果的数组
    const chartContainer = ref<HTMLDivElement | null>(null); // 用于存储 ECharts 容器 DOM 元素的引用
    const dataReady = ref(false); // 标志变量，表示数据是否准备好
    const showReloadButton = ref(false); // 控制重新加载按钮的显示
    const jsonData = ref<JsonData>([]);
    const wordcloudUrl = ref("");

    jsonData.value = JSON.parse(store.chap);
    // 使用computed来计算只包含content.value的字符串数组
    const contentValues = computed(() => {
      if (jsonData.value && jsonData.value.length > 0) {
        // 使用flatMap来展平content数组，然后使用map来提取point属性
        return jsonData.value.flatMap((chapter) => chapter.content.map((cont) => cont.point));
      }
      // 如果没有数据，返回一个空数组
      return [];
    });
    // 发送文本到后端并获取词云图片的URL
    const generateWordCloud = async () => {
      try {
        // 发送POST请求到Flask后端
        const response = await axios.post(
          `${store.apiBaseURI}/wordcloud`,
          {
            text_array: contentValues.value,
          },
          {
            responseType: "blob", // 告诉axios期望返回的数据类型为blob
          }
        );

        // 创建Blob URL
        wordcloudUrl.value = URL.createObjectURL(new Blob([response.data], { type: "image/png" }));
        console.log("##########", wordcloudUrl.value);
      } catch (error) {
        console.error("Error fetching wordcloud:", error);
      }
    };

    const initChart = () => {
      if (chartContainer.value) {
        const chart = echarts.init(chartContainer.value);
        const option = {
          title: {
            text: "图谱显示",
          },
          tooltip: {
            overflow: "truncate",
            show: true, // 显示提示框
            formatter: function (x: { dataType: string; data: { label: any } }) {
              // x参数包含触发提示框的图形的数据信息
              if (x.dataType === "node") {
                // 如果是节点
                return x.data.label; // 显示节点的名称
              } else if (x.dataType === "edge") {
                // 如果是边
                return x.data.label; // 显示边的名称
              }
            },
          },

          series: [
            {
              categories: category,
              type: "graph",
              layout: "force", // 使用力引导布局
              force: {
                // repulsion: 1000, // 增加斥力
                // edgeLength: 200 // 增加边长
                repulsion: 800, // 节点之间的斥力
                edgeLength: 400, // 边的长度
                gravity: 0.1, // 引力
                initLayout: "none",
              },
              animation: false,

              data: echartsData.value,
              links: nodesRelation.value,
              // data: data.nodes,
              // links: data.links,
              roam: true, // 开启拖拽和缩放

              label: {
                show: true,
                position: "inside",
                // formatter: '{b}'
                // 设置 minZoom 和 maxZoom 来控制标签的显示
                minZoom: 1.5, // 缩小到一定程度后，标签将不再显示
                maxZoom: 0.5, // 放大到一定程度后，标签将开始显示
                formatter: function (x: { data: { label: any } }) {
                  return x.data.label;
                },
              },
              symbolSize: 60,

              edgeSymbol: ["circle", "arrow"],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                normal: {
                  show: true,
                  position: "middle",

                  formatter: function (x: { data: { label: any } }) {
                    return x.data.label;
                  },
                },
              },

              lineStyle: {
                opacity: 1, // 设置线的透明度
              },
            },
          ],
        };
        // console.log('Links data:', option.series[0].links);
        chart.setOption(option);
        console.log("ok");
        showReloadButton.value = false; // 初始化成功后，不需要显示重新加载按钮
      } else {
        // 如果数据未准备好，显示重新加载按钮
        showReloadButton.value = true;
      }
    };
    const reloadChart = () => {
      // 重新加载图谱的代码
      showReloadButton.value = false;
      // // 重新执行Cypher查询和初始化图表
      // var query = 'MATCH p=()-->() RETURN p';
      // // var query = 'MATCH p=()-[r:`发生年份`]->() RETURN p LIMIT 25';
      // executeCypher(query);
      // setTimeout(() => {
      //   initChart();
      // }, 5000); // 等待 500 毫秒后初始化 ECharts
      const route = useRoute();

      const jsonDataString = route.query.jsonData;
      if (typeof jsonDataString === "string" && jsonDataString) {
        try {
          const data = JSON.parse(jsonDataString);
          echartsData.value = data.nodes;
          nodesRelation.value = data.links;

          console.log("Received JSON data:", data);
        } catch (error) {
          console.error("Error parsing JSON data:", error);
          showReloadButton.value = true;
        }
      }
      initChart();
    };

    onMounted(() => {
      // var query = 'MATCH p=()-->() RETURN p';
      // // var query = 'MATCH p=()-[r:`发生年份`]->() RETURN p LIMIT 25';
      // executeCypher(query);
      // setTimeout(() => {
      //   initChart();
      // }, 5000); // 等待 5000 毫秒后初始化 ECharts
      const route = useRoute();

      const jsonDataString = route.query.jsonData;

      if (typeof jsonDataString === "string" && jsonDataString) {
        try {
          const data = JSON.parse(jsonDataString);
          echartsData.value = data.nodes;
          nodesRelation.value = data.links;
          console.log(echartsData.value);
        } catch (error) {
          console.error("Error parsing JSON data:", error);
          showReloadButton.value = true;
        }
      }

      initChart();
    });

    const downloadImage = () => {
      if (chartContainer.value) {
        // 获取 ECharts 实例
        const chartInstance = echarts.getInstanceByDom(chartContainer.value);
        if (!chartInstance) {
          ElMessage.error("图表实例未找到，无法下载");
          return;
        }

        // 获取整个图表的图片 URL
        const picUrl = chartInstance.getConnectedDataURL({
          pixelRatio: 2, // 提高图片的分辨率
          backgroundColor: "#fff", // 设置背景色
        });

        // 创建一个 a 标签用于下载
        const a = document.createElement("a");
        a.href = picUrl;
        a.download = "chart.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };

    return {
      store,
      goToDocumentIptPage,
      // graphVis
      // executeCypher,
      chartContainer,
      reloadChart,
      showReloadButton,
      downloadImage,
      generateWordCloud,
      wordcloudUrl,
      contentValues,
    };
  },
};

function saveAs(src: any, arg1: string) {
  throw new Error("Function not implemented.");
}
</script>

<style lang="less" scoped>
.documentIpt_all {
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
    left: 50%;
    transform: translateX(-50%);
    color: #ffffff;
    font-weight: 700;
    font-size: 74px;
  }
  .p_bottom {
    position: absolute;
    top: 170px;
    left: 50%;
    transform: translateX(-50%);
    /deep/ .el-breadcrumb__item > span {
      color: #ffffff;
      font-size: 15px;
      font-weight: normal;
    }
  }
}
.documentIpt_main {
  padding: 0;
  height: 1100px;
  position: relative;

  .content_container {
    background-color: #b49c73;
    width: 100%;
    height: 80vh;
    position: absolute; /* 使用绝对定位 */
    top: 38%;
    left: 50%;
    transform: translate(-50%, -50%); /* 水平垂直居中 */
    border-radius: 10px; /* 设置圆角半径 */
    display: flex; /* 使用flex布局 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }

  .content {
    background-color: white; /* 白色背景 */
    width: 98%; /* 宽度充满容器 */
    height: 98%; /* 高度充满容器 */
    border-radius: 10px; /* 设置圆角半径 */
    //padding: 20px; /* 内边距 */
    //box-sizing: border-box; /* 包括内边距和边框的尺寸 */
    display: flex; /* 使用flexbox布局 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    .reload-container {
      display: flex;
      align-items: center; /* 垂直居中 */
    }

    .reload-image {
      width: 200px; /* 根据您的图片大小调整宽度 */
      height: 200px; /* 根据您的图片大小调整高度 */
      margin-right: 10px; /* 在图片和文本之间添加一些空间 */
    }

    .reload-link {
      color: #007bff; /* 使用浅蓝色 */
      text-decoration: none; /* 去除下划线 */
      cursor: pointer; /* 设置鼠标悬停时的光标样式 */
    }
  }
  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 200px; /* 添加按钮之间的间距 */
  }
  .documentIpt_btn {
    //margin-right: 300px;
    margin-top: 820px;
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
