<template>
  <!--  v-loading="loading" element-loading-background="rgba(255, 255,255,0.8)"-->
  <!--  element-loading-text="拼命加载中..." element-loading-spinner=".el-loading-spinner"-->
  <el-container
    class="documentIpt_all"
    v-show="!loading">
    <el-header
      class="documentIpt_header"
      height="220px">
      <p :class="{ shifted: drawerVisible }">{{ store.text }}</p>
      <el-breadcrumb
        class="p_bottom"
        separator=">>"
        :class="{ shifted: drawerVisible }">
        <el-breadcrumb-item :to="{ path: '/' }">HOME</el-breadcrumb-item>
        <el-breadcrumb-item>FILE-UPLOAD</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        size="large"
        type="primary"
        class="documentIpt_btn"
        @click="drawerVisible = true">
        <span class="long-arrow-left">←|</span>
      </el-button>
    </el-header>
    <!--    accept=".docx"-->
    <el-main class="documentIpt_main">
      <div
        class="left"
        :class="{ shifted: drawerVisible }">
        <p style="text-align: center; font-size: 28px; font-weight: bold; margin-top: 30px">
          Uplode File
        </p>
        <el-upload
          class="upload"
          ref="upload"
          drag
          :http-request="customUpload"
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleFileChange">
          <div class="el-upload-dragger">
            <el-icon
              class="el-icon--upload"
              style="margin-top: 20px"
              ><upload-filled
            /></el-icon>
            <div
              class="el-upload__text"
              style="text-align: center; font-size: 18px; font-weight: bold; margin-top: 20px">
              Drop file here or <em>click to upload</em>
            </div>
          </div>
        </el-upload>

        <div class="buttons-container">
          <el-button
            size="large"
            type="primary"
            class="documentIpt_btn"
            @click="submitUpload"
            >文件上传</el-button
          >
          <el-button
            size="large"
            type="primary"
            class="documentIpt_btn"
            @click="submittextStructure"
            >知识点生成</el-button
          >
          <el-button
            size="large"
            type="primary"
            class="documentIpt_btn"
            @click="goToSearchPage"
            >返回</el-button
          >
          <!--          <el-button size="large" type="primary" class="documentIpt_btn" @click="gotoNext">跳转</el-button>-->
        </div>
      </div>
      <!-- 文档内容抽屉 ，已废弃-->
      <div
        class="side-panel"
        :class="{ active: drawerVisible }">
        <div
          class="title-container"
          style="position: sticky; top: 0">
          <h2 class="title">文件预览</h2>
          <el-button
            class="close-btn"
            @click="handleClose">
            <el-icon
              class="el-icon--close"
              style="position: absolute; top: 0; right: 10px"
              >×</el-icon
            >
          </el-button>
        </div>
        <div
          v-if="fileContent"
          class="file-content">
          <pre>{{ fileContent }}</pre>
        </div>
      </div>
    </el-main>
  </el-container>

  <el-container
    class="loadingall"
    v-show="loading">
    <div class="loadingleft">
      <img
        src="../assets/rerun.gif"
        alt="Loading Image"
        style="width: 300px; height: 200px; margin-top: 190px; margin-left: 130px" />
      <!--      <h1 style="font-size: 32px;margin-top: 190px;margin-left: 130px">知识点抽取</h1>-->
      <div class="progress-container">
        <div
          class="progress-bar"
          :style="{ width: progress + '%' }">
          <span style="margin-left: 400px; color: white">{{ progress }}%</span>
        </div>
        <p class="progress-text">{{ progressText }}</p>
      </div>
    </div>
    <div class="loadingright">
      <!-- 图片和文字容器，使用Vue的数据绑定和定时器来更新 -->
      <div
        class="image-text-container"
        style="margin-top: 80px; width: 800px; padding-left: 50px">
        <h1 style="font-size: 32px; text-align: center">课程知识点</h1>
        <p
          style="
            font-size: 26px;
            padding-top: 50px;
            padding-right: 100px;
            padding-bottom: 30px;
            padding-left: 50px;
          ">
          &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{ currentText }}
        </p>
        <img
          src="../assets/gr.png"
          v-show="currentIndex == 0"
          alt="Loading Image"
          style="width: 650px; height: 350px; padding-left: 70px" />
        <img
          src="../assets/loadingpicture/loading2.jpg"
          v-show="currentIndex == 1"
          alt="Loading Image"
          style="width: 650px; height: 350px; padding-left: 70px" />
        <img
          src="../assets/loadingpicture/loading3.jpg"
          v-show="currentIndex == 2"
          alt="Loading Image"
          style="width: 650px; height: 350px; padding-left: 70px" />
        <img
          src="../assets/loadingpicture/loading4.jpg"
          v-show="currentIndex == 3"
          alt="Loading Image"
          style="width: 650px; height: 350px; padding-left: 70px" />
        <img
          src="../assets/loadingpicture/load5.jpg"
          v-show="currentIndex == 4"
          alt="Loading Image"
          style="width: 650px; height: 350px; padding-left: 70px" />
      </div>
    </div>
  </el-container>
</template>

<script lang="ts">
import { computed, onBeforeUnmount, ref, watch, onMounted } from "vue";
import { ElMessage, genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { Document, UploadFilled } from "@element-plus/icons-vue";
import axios from "axios";

import "../assets/css/loading.css";

export default {
  name: "DocumentIpt",
  components: { Document, UploadFilled },
  setup() {
    const { useStore } = require("../store/index.js");
    const store = useStore();
    const router = useRouter();
    const showPopup = ref(false);
    const showProgressBar = ref(false);
    const progress = ref(0);
    const progressStatus = ref();
    const drawerVisible = ref(false);
    const fileContent = ref();
    const loading = ref(false);
    //当前是否已经上传了文件
    const flag = ref(false);

    const goToSearchPage = function () {
      router.push({
        name: "Home",
      });
    };

    //测试
    const gotoNext = function () {
      store.text = "文档预览";
      router.push({
        name: "ShowDocument",
      });
    };

    const upload = ref<UploadInstance>();

    /**  这个函数是为了处理用户尝试上传超过限制的文件数量的情况。当这种情况发生时，
     * 它会清除已上传的文件列表，为新文件分配一个唯一ID，并开始处理这个新文件。
     **/
    const handleExceed: UploadProps["onExceed"] = (files) => {
      console.log(upload);
      upload.value!.clearFiles();
      const file = files[0] as UploadRawFile;
      file.uid = genFileId();
      upload.value!.handleStart(file);
    };

    const submitUpload = () => {
      upload.value!.submit();
    };

    // // 将教材文档发往后端
    // const url = 'http://10.21.22.111:5000/upload';
    // const customUpload = (options: { file: string | Blob; }) => {
    //   // 自定义上传行为
    //   const formData = new FormData();
    //   formData.append('file', options.file);
    //
    //   return new Promise((resolve, reject) => {
    //     fetch(url, {
    //       method: 'POST',
    //       body: formData
    //     })
    //         .then((response) => {
    //           if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //           }
    //           return  response.text();
    //         })
    //         .then((data) => {
    //           resolve(data);
    //         })
    //         .catch((error) => {
    //           reject(error);
    //         });
    //   });
    // };

    const urlUpload = `${store.apiBaseURI}/upload`;
    const urlChange = `${store.apiBaseURI}/#`;

    const customUpload = (options: { file: any }) => {
      return new Promise((resolve, reject) => {
        const file = options.file;
        if (
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          // .docx 类型，直接上传
          uploadFileToUrl(file, urlUpload).then(resolve).catch(reject);
        } else if (file.type === "application/pdf") {
          // .pdf 类型，先转换后上传
          changePdfToDocx(file)
            .then((convertedFile) => {
              uploadFileToUrl(convertedFile, urlUpload).then(resolve).catch(reject);
            })
            .catch(reject);
        } else {
          // 其他类型，提示不支持
          reject(new Error("不支持的文件类型"));
        }
      });
    };

    const uploadFileToUrl = (file: string | Blob, url: RequestInfo) => {
      const formData = new FormData();
      formData.append("file", file);

      return fetch(url, {
        method: "POST",
        body: formData,
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      });
    };

    const changePdfToDocx = (file: string | Blob) => {
      const formData = new FormData();
      formData.append("file", file);

      return fetch(urlChange, {
        method: "POST",
        body: formData,
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob(); // 假设返回的是转换后的 .docx 文件
      });
    };

    const handleSuccess = (response: any, file: any, fileList: any) => {
      ElMessage.success("文件上传成功！");
      console.log(response);
      flag.value = true;
    };

    const handleError = (err: any, file: any, fileList: any) => {
      ElMessage.error("文件上传失败！");
      console.log(err);
    };

    // 抽取知识点
    const submittextStructure = () => {
      // 发送 POST 请求
      if (flag.value == true) {
        loading.value = true;
        progress.value = 0;
        progressText.value = "数据清理中...";
        startFakeProgress();
        axios
          .post(`${store.apiBaseURI}/extract`)
          .then((response) => {
            progress.value = 100;
            progressText.value = "抽取完成";
            progressStatus.value = "success";
            // clearInterval(interval);

            // 跳转至顶部
            window.scrollTo(0, 0);

            // 处理响应数据
            console.log(response.data);

            // 处理响应数据
            console.log(response.data);

            // 将JSON数据转换为字符串
            const jsonData = JSON.stringify(response.data);
            store.chap = jsonData;
            // 使用路由参数传递数据
            router.push({
              name: "ShowDocument",
              query: { jsonData }, // 使用查询参数传递JSON数据
            });
            //上传完毕之后标志清空
            flag.value = false;
            // 上传成功后清除文件列表
            upload.value!.clearFiles(); //待定？？？

            loading.value = false;
          })
          .catch((error) => {
            progressStatus.value = "exception";
            // 处理错误
            console.error("There was an error!", error);
          });

        sessionStorage.setItem("flag", "false");
      } else {
        ElMessage.error("请先上传文件");
      }
    };
    const handleFileChange = (file: { raw: Blob | null }) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 确保 e.target 不是 null
        if (e.target) {
          fileContent.value = e.target.result;
          // drawerVisible.value = true;
        } else {
          ElMessage.error("文件读取失败");
        }
      };
      if (file && file.raw) {
        reader.readAsText(file.raw);
      } else {
        ElMessage.error("选择的文件无效");
      }
    };

    // 关闭抽屉
    const handleClose = () => {
      drawerVisible.value = false;
      // fileContent.value = '';
    };

    // const images = [
    //
    // ];
    const texts = [
      "课程知识点是指一门课程中需要学生掌握和理解的基本概念、原理、方法、技能等核心内容。这些知识点是构成课程框架的基石，是学生获取新知识、形成新技能、提升思维能力的关键。",
      "基础性：课程知识点是课程的基础和核心，是学生理解和掌握课程的前提。它们为学生提供了必要的概念、原理和方法，是学生进一步学习和发展的基础。",
      "系统性：课程知识点之间往往存在紧密的逻辑关系，形成一个有机的系统。学生需要理解和掌握这些知识点之间的联系，形成完整的知识体系。",
      "实用性：课程知识点应该具有实际应用价值，能够帮助学生解决实际问题。通过学习和掌握这些知识点，学生可以提高自己的实践能力和创新能力。",
      "可评估性：课程知识点应该具有可评估性，教师可以通过测试和作业等方式来检验学生对知识点的掌握程度。这有助于教师了解学生的学习情况，及时调整教学策略。",
      // ... 其他文本
    ];
    const currentIndex = ref(0); // 当前显示的图片和文本的索引

    // 图片和文字切换逻辑
    const switchImageAndText = () => {
      currentIndex.value = (currentIndex.value + 1) % texts.length;
    };

    let imageTextTimer: number | null = null; // 初始化为 null 是个好习惯，以防在其他地方意外使用

    // 响应式引用，用于模板中
    // const currentImage = computed(() => images[currentIndex.value]);
    const currentText = computed(() => texts[currentIndex.value]);

    const progressText = ref("数据清理中...");
    let intervalId: number | null | undefined = null;
    let slowIntervalId: number | null | undefined = null;
    const startFakeProgress = () => {
      intervalId = setInterval(() => {
        progress.value++; // 每秒增加1%
        if (progress.value >= 90) {
          // 当进度到达90%时，清除快速定时器并启动慢速定时器
          clearInterval(intervalId!);
          startSlowProgress();
        } else if (progress.value === 30) {
          progressText.value = "模型启动中...";
        } else if (progress.value === 50) {
          progressText.value = "知识点抽取中...";
        }
      }, 1250); // 每1.25秒更新一次（但这里我们近似为每秒）

      // // 为了模拟2分钟的进度条，我们设置一个延迟来在2分钟后自动完成
      // setTimeout(() => {
      //   progress.value = 100;
      // }, 120 * 1000); // 2分钟 = 120秒
    };
    // 慢速增加进度的函数
    const startSlowProgress = () => {
      slowIntervalId = setInterval(() => {
        if (progress.value < 98) {
          progress.value++; // 每8秒增加1%
          if (progress.value === 91) {
            progressText.value = "知识点处理中..."; // 可以在95%时更新文本，或者其他你喜欢的点
          }
        } else {
          // 当进度到达98%时，清除定时器
          clearInterval(slowIntervalId!);
          // 可以在这里添加进度完成的后续操作
        }
      }, 8000); // 每8秒更新一次
    };

    onMounted(() => {
      imageTextTimer = setInterval(switchImageAndText, 10000); // 每3秒切换一次
    });

    // 清除定时器
    onBeforeUnmount(() => {
      if (imageTextTimer) {
        // 简化检查，因为 imageTextTimer 不可能是 undefined
        clearInterval(imageTextTimer);
        imageTextTimer = null; // 清除定时器后，将变量设置为 null
      }
      clearInterval(intervalId!);
    });

    return {
      upload,
      store,
      handleExceed,
      submitUpload,
      goToSearchPage,
      gotoNext,
      customUpload,
      handleSuccess,
      handleError,
      submittextStructure,
      showProgressBar,
      progress,
      progressStatus,
      drawerVisible,
      fileContent,
      handleClose,
      handleFileChange,
      showPopup,
      loading,
      currentText,
      switchImageAndText,
      currentIndex,
      progressText,
    };
  },
};
</script>

<style lang="less" scoped>
.documentIpt_all {
  background-image: url(../assets/gr.png);
  background-size: cover;
}
.documentIpt_header {
  padding: 0;
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
  p.shifted {
    transform: translateX(-550px); /* 原页面内容左移 */
    transition: transform 0.3s; /* 平滑过渡效果 */
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
  .p_bottom.shifted {
    transform: translateX(-480px); /* 原页面内容左移 */
    transition: transform 0.3s; /* 平滑过渡效果 */
  }
  .long-arrow-left {
    font-size: 24px; /* 设置字体大小 */
    font-weight: bold; /* 设置字体加粗 */
    margin-left: 5px;
  }
  .documentIpt_btn {
    position: absolute;
    top: 100px; /* 相对于页面的右上角定位 */
    right: -5px; /* 相对于页面的右上角定位 */
    background-color: transparent; /* 清除背景色 */
    border: none; /* 清除边框 */
    color: #fff; /* 设置文字颜色 */
    text-align: center;
    cursor: pointer;
  }
}
.documentIpt_main {
  padding: 0;
  height: 460px;
  position: relative;
  .left {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 650px;
    height: 400px;
    background-color: white;
    border-radius: 5px;

    .upload {
      //position: absolute;
      //top: 20px;
      //left: 50%;
      //transform: translateX(-50%);
      //width: 550px;
      //height: 180px;
      //padding: 10px;
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      padding: 0;
      margin: 0;
      border: none; /* 如果存在边框，也去除 */
      box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3); /* 你可以根据需要调整阴影的大小、颜色和模糊度 */
    }
    .el-upload-dragger {
      width: 100%;
      height: 100%;
      padding: 0; /* 去除内边距 */
      margin: 0; /* 去除外边距 */
      border: none; /* 如果有边框也去除 */
      display: flex; /* 使用弹性布局来确保内容居中 */
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
      background-image: url("../assets/loadingpicture/bgl2.jpg");
      background-repeat: no-repeat; /* 确保图片不重复 */
      background-position: center center; /* 图片居中显示 */
      background-size: cover; /* 缩放图片以完全覆盖容器 */
    }
    .buttons-container {
      display: flex;
      justify-content: center;
      gap: 100px; /* 添加按钮之间的间距 */
    }
    .documentIpt_btn {
      //margin-right: 300px;
      margin-top: 250px;
      width: 120px;
      height: 50px;
      background-color: wheat;
      border-color: wheat;
      color: black;
      font-size: 20px;
      font-weight: 800;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    }
    //b49c73
  }
  //.readin{
  //  margin-left: 340px;
  //  margin-top: 240px;
  //  margin-right: 340px;
  //}
  /* 进度条样式 */
  //.progress-bar {
  //  width: 60%;
  //  margin-top: 20px;
  //  margin-left: auto; /* 自动计算左边距 */
  //  margin-right: auto; /* 自动计算右边距 */
  //}
}

//.documentIpt_footer {
//  margin-left: 480px;
//
//  .documentIpt_btn {
//    margin-right: 100px;
//    width: 100px;
//    height: 50px;
//    background-color: #b49c73;
//    border-color: #b49c73;
//    color: black;
//    font-size: 20px;
//    font-weight: 800;
//  }
//}
.side-panel {
  position: fixed;
  top: 5px;
  right: -100%;
  bottom: 0;
  width: 600px;
  background: #f9f9f9;
  z-index: 2;
  overflow-y: auto;
  transition: right 0.3s;
  border: 1px solid #eaeaea; /* 添加边框 */
  box-shadow: -5px 0 5px rgba(0, 0, 0, 0.2);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.title-container {
  padding: 0;
  background: #b49c73; /* 标题背景色 */
  border-bottom: 1px solid #eaeaea;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex; /* 使容器变为flex布局 */
}
.title {
  font-size: 25px;
  font-weight: bold;
  margin: 0;
  color: white;
}

.side-panel.active {
  right: 0; /* 显示侧边面板 */
}

.file-content {
  padding: 20px;
  word-wrap: break-word; /* 允许长单词换行 */
  white-space: pre-wrap; /* 保持换行和空格 */
  height: 635px; /* 设置一个最小高度，以便内容能够显示 */
  overflow-y: auto; /* 内容过多时允许滚动 */
}
.close-btn {
  display: block;
  width: 81%;
  padding: 0;
  background-color: transparent; /* 清除背景色 */
  border: none; /* 清除边框 */
  color: #b49c73; /* 设置关闭按钮文字颜色 */
  text-align: center;
  cursor: pointer;
}
/* 移除点击时的背景颜色变化效果 */
.close-btn:hover {
  background-color: transparent;
}
.close-btn .el-icon--close {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 40px; /* 调整图标大小 */
  cursor: pointer;
}

.left.shifted {
  transform: translateX(-650px); /* 原页面内容左移 */
  transition: transform 0.3s; /* 平滑过渡效果 */
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 999;
  width: 300px;
  height: 200px;
  pointer-events: none; /* 使弹窗外的内容不可操作（没管用） */
  align-items: center; /* 垂直居中 */
  justify-content: center;
}

.popup-content {
  display: flex;
  //align-items: center;
  //justify-content: center;
  justify-content: flex-start; /* 靠左对齐 */
  //align-items: center; /* 垂直居中 */
  //justify-content: space-between; /* 居中对齐，并允许进度条和文本之间的间隔 */
  align-items: center; /* 垂直居中 */
  flex-wrap: wrap; /* 允许换行 */
}

.progress-bar {
  height: 20px;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s ease-in-out;
}
.progress-text {
  margin-left: 25px;
}
span {
  margin-left: 10px;
}
.loadingall {
  height: 100vh;
  width: 100vw;
  display: flex; /* 使用 Flexbox 布局 */
  .loadingleft {
    background-color: #b49c73;
    //width: 600px;
    //height: 700px;
    flex: 0 0 40%; /* 占据 40% 的宽度，并且不会收缩或增长 */
  }
  .loadingright {
    //width: 800px;
    //height: 700px;
    flex: 0 0 60%; /* 占据 40% 的宽度，并且不会收缩或增长 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }
}
.progress-container {
  margin-left: 80px;
  width: 60%; /* 或其他你需要的宽度 */
  height: 20px; /* 或其他你需要的高度 */
  background-color: #f5f5f5; /* 可选：为容器设置背景色 */
}

.progress-bar {
  height: 100%;
  background-color: #007bff; /* 进度条的颜色 */
  transition: width 0.5s ease; /* 可选：添加过渡效果 */
}
.progress-text {
  //font-size: 50px;
  color: white;
  margin-left: 10px;
}
</style>
