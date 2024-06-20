<template>
  <el-container>
    <el-header
      class="home_header"
      height="400px">
      <el-carousel
        trigger="click"
        height="500px"
        indicator-position="none"
        :autoplay="true"
        arrow="always"
        class="header_carousel">
        <el-carousel-item>
          <div class="header_carousel_zeroth outer">
            <div class="inner">
              <p>WELCOME TO THE EDUCATION AND TRAINING MODEL “ZI LU”</p>
              <p>欢迎来到教培大模型“子路”</p>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="header_carousel_first outer">
            <div class="inner">
              <p>WELCOME TO THE EDUCATION AND TRAINING MODEL “ZI LU”</p>
              <p>欢迎来到教培大模型“子路”</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-header>
    <el-main class="home_main">
      <div class="main_up">
        <!--        <p class="main_up_outer_p">我们的功能</p>-->
        <el-space wrap>
          <el-card @click="toAccusationPrediction">
            <div>
              <el-icon
                color="#b49c73"
                size="50px">
                <Reading />
              </el-icon>
            </div>
            <p>文档知识点抽取</p>
            <p>根据上传的文档抽取知识点</p>
          </el-card>
          <el-card @click="toRecommendedArticleOfLaw">
            <div>
              <el-icon
                color="#b49c73"
                size="50px">
                <Aim />
              </el-icon>
            </div>
            <p>自动化构建图谱</p>
            <p>根据上传的知识点自动生成图谱</p>
          </el-card>
          <el-card @click="toCaseSearch">
            <div>
              <el-icon
                color="#b49c73"
                size="50px">
                <DocumentCopy />
              </el-icon>
            </div>
            <p>自动出题</p>
            <p>根据上传知识点自动出题</p>
          </el-card>
        </el-space>
      </div>

      <div id="bottom"></div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { Aim, DocumentCopy, Edit, PictureRounded, Reading } from "@element-plus/icons-vue";
import axios from "axios";

export default {
  name: "Home",
  components: { Edit, Aim, PictureRounded, DocumentCopy, Reading },
  methods: {
    scrollToBottom() {
      const bottomElement = document.getElementById("bottom");
      if (bottomElement) {
        const bottomOffset = bottomElement.offsetTop;
        window.scrollTo({ top: bottomOffset, behavior: "smooth" });
      }
    },
  },
  setup() {
    // 路由示例，取代 $router
    const router = useRouter();
    const { useStore } = require("../store/index.js");
    const store = useStore();

    const routerJump = function () {
      router.push({
        name: "DocumentIpt",
      });
    };
    // 跳转类案检索

    const toAccusationPrediction = function () {
      store.text = "文档知识点抽取 ";
      store.flagNumSignItem = 1;
      routerJump();
    };
    const toRecommendedArticleOfLaw = function () {
      store.text = "自动化构建图谱";
      store.flagNumSignItem = 2;

      // 假设 store.chap 是一个对象或数组，您想要将其作为 JSON 文件传递
      const chapData = store.chap;

      // 将数据转换为 JSON 字符串
      const chapJSON = JSON.parse(chapData);
      console.log("这里是chapJSON", chapJSON);
      const chapJSONString = JSON.stringify(chapJSON);
      // 创建一个 Blob 对象，将 JSON 字符串转换为 JSON 文件
      const blob = new Blob([chapJSONString], { type: "application/json" });

      // 创建一个 File 对象，假设文件名为 chap.json
      const file = new File([blob], "chap.json");
      console.log("这是file内容=======================", file);
      // 创建一个 FormData 对象
      const formData = new FormData();
      // 将 File 添加到 FormData 对象中
      formData.append("file", file);

      // 使用 Axios 发送 POST 请求
      axios
        .post(`${store.apiBaseURI}/web_modify_graph`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // 处理响应数据
          console.log("返回来的数据是", response.data);

          // 将JSON数据转换为字符串
          const jsonData = JSON.stringify(response.data);
          // const jsonData = response.data;

          // 使用路由参数传递数据
          router.push({
            name: "DisplayGraph1",
            query: { jsonData }, // 使用查询参数传递JSON数据
          });
        })
        .catch((error) => {
          // 处理错误
          console.error("There was an error!", error);
        });

      // axios.post('http://10.21.22.111:5000/graph')
      //     .then(response => {
      //
      //       // 处理响应数据
      //       console.log(response.data);
      //
      //       // 将JSON数据转换为字符串
      //       const jsonData = JSON.stringify(response.data);
      //       // const jsonData = response.data;
      //
      //       // 使用路由参数传递数据
      //       router.push({
      //         name: 'DisplayGraph1',
      //         query: {jsonData} // 使用查询参数传递JSON数据
      //       });
      //     })
      //     .catch(error => {
      //       // 处理错误
      //       console.error('There was an error!', error);
      //     });
    };
    const toCaseSearch = function () {
      store.text = "自动出题";
      store.flagNumSignItem = 3;
      router.push({
        name: "page2",
      });
    };
    // const toFeatureExtraction = function () {
    //   store.text = '要素抽取'
    //   store.flagNumSignItem = 4
    //   routerJump()
    // }
    return {
      toCaseSearch,
      toAccusationPrediction,
      toRecommendedArticleOfLaw,
    };
  },
};
</script>

<style lang="less" scoped>
.home_header {
  padding: 0;
  position: relative; /* 或者其他定位方式，取决于你的布局需求 */
  z-index: 1;
  .header_carousel {
    /deep/ .el-carousel__arrow {
      width: 50px;
      height: 50px;
      border-radius: 5px;
      i {
        font-size: 30px;
      }
      background-color: rgba(0, 0, 0, 0.3);
    }
    /deep/ .el-carousel__arrow:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }

    /deep/ .el-carousel__arrow--left {
      left: 90px;
    }
    /deep/ .el-carousel__arrow--right {
      right: 90px;
    }
    .outer {
      width: 100%;
      height: 100%;
      background-size: cover !important;
      .inner {
        width: 100%;
        height: 100%;
        text-align: center;
        margin: 0 auto;
        background-color: rgba(36, 36, 36, 0.7);
        padding-top: 215px;
        p {
          padding: 10px 0;
          color: white;
        }
        p:nth-child(1) {
          font-size: 25px;
        }
        p:nth-child(2) {
          font-size: 85px;
          font-weight: 700;
        }
        .btn {
          background-color: #b49c73;
          border-color: #b49c73;
          color: black;
          height: 55px;
          width: 130px;
          font-weight: 700;
        }
      }
    }
    .header_carousel_zeroth {
      background: url(../assets/gr.png) no-repeat;
    }
    .header_carousel_first {
      background: url(../assets/知识图谱图片2.png) no-repeat;
    }
    //.header_carousel_second {
    //  background: url(../assets/115028261_0_final.png) no-repeat;
    //}
  }
}

.home_main {
  position: relative; /* 或者 absolute，取决于你的需求 */
  z-index: 2;

  .main_up,
  .main_bottom {
    height: 500px;
    position: relative;
  }
  .main_up {
    text-align: center;
    padding-top: 10px;
    //.main_up_outer_p {
    //  font-size: 50px;
    //  font-weight: 700;
    //  margin-bottom: 20px;
    //  color: #b49c73;
    //}
    .el-card {
      width: 300px;
      height: 300px;

      p:nth-of-type(1) {
        font-size: 20px;
        margin-bottom: 15px;
      }
      p:nth-of-type(2) {
        font-size: 15px;
        color: #aaaaaa;
        padding: 10px;
      }
      div {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #37373f;
        margin: 20px auto;
        padding: 20px;
      }
    }
  }
}
</style>
