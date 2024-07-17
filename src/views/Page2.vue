<template>
  <el-container class="documentIpt_all">
    <el-header
      class="documentIpt_header"
      height="180px">
      <p :class="{ shifted: drawerVisible }">{{ store.text }}</p>
      <el-breadcrumb
        class="p_bottom"
        separator=">>"
        :class="{ shifted: drawerVisible }">
        <el-breadcrumb-item :to="{ path: '/' }">HOME</el-breadcrumb-item>
        <el-breadcrumb-item>AUTOMATIC-QUESTION</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        size="large"
        type="primary"
        class="documentIpt_btn"
        @click="
          drawerVisible = true;
          bool = false;
        ">
        <!--        刚改的，不知道顶不顶用-->
        <span class="long-arrow-left">←|</span>
      </el-button>
    </el-header>

    <el-main class="documentIpt_main">
      <el-button
        size="large"
        type="primary"
        style="
          width: 200px;
          height: 40px;
          margin-bottom: 10px;
          margin-left: 20px;
          background-color: wheat;
          border-color: wheat;
          font-size: 20px;
          font-weight: 800;
          color: black;
        "
        @click="goToZujuan"
        >组卷</el-button
      >
      <el-table
        :style="tableWidthStyle"
        empty-text="没有数据"
        :data="chapters">
        <!--          <el-table-column prop="value" label="知识点" @click="show"></el-table-column>-->
        <el-table-column
          prop="title"
          label="章节">
          <template v-slot:default="{ row }">
            <div class="topic-container">
              <h3 @click="showTopic(row)">{{ row.title }}</h3>
              <ul v-if="row.expanded">
                <li
                  v-for="con in row.content"
                  :key="con.point"
                  style="font-size: 17px">
                  <!-- 添加勾选框 -->
                  <el-checkbox
                    v-model="con.isChecked"
                    @change="handleCheckboxChange(row, con)"></el-checkbox>
                  {{ con.point }}
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 文档内容抽屉 -->
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
              style="color: black; position: absolute; top: 0; right: 10px"
              >×</el-icon
            >
          </el-button>
        </div>
        <!--        <p style="font-size: 25px;" v-if="!fileContent">根据以下知识点，生成10道题</p>-->
        <!--        <p style="font-size: 25px;" v-if="fileContent">题目如下</p>-->
        <div style="height: 570px; overflow-y: auto">
          <div v-if="selectedContent.length">
            <p v-for="item in selectedContent">
              {{ item.summary }}
            </p>
          </div>
          <div
            v-if="fileContent"
            class="file-content">
            <pre class="auto-wrap">{{ fileContent }}</pre>
          </div>
        </div>

        <div>
          <!--          <div class="counter-container">-->
          <!--            <span style="font-size: 18px;font-weight:bold; margin-left: 40px;">每个知识点生成题目数量：</span>-->

          <!--            <el-button @click="decrementTopic" style="margin-left: 160px;">-</el-button>-->
          <!--            {{ topicCount }}-->
          <!--            <el-button @click="incrementTopic">+</el-button>-->
          <!--          </div>-->
          <div class="choices">
            <el-select
              v-model="questionType"
              placeholder="请选择题型"
              style="box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)">
              <el-option
                v-for="item in questionsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select
              v-model="generateMode"
              placeholder="请选择生成方式"
              style="box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)">
              <el-option
                v-for="item in generateModeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select
              v-model="difficultyLevel"
              collapse-tags
              style="box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
              placeholder="请选择难度等级">
              <el-option
                v-for="item in difficultyLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="buttons-container">
            <el-button
              size="large"
              type="primary"
              class="documentIpt_btn"
              @click="generateQuestions"
              >生成题目</el-button
            >
            <!--            <el-button size="large" type="primary" class="documentIpt_btn" @click="goToSearchPage">返回</el-button>-->
          </div>
          <!-- 提示信息 -->
          <el-alert
            v-if="showSuccessMessage"
            type="success"
            :closable="false"
            style="display: inline-block">
            传输成功
          </el-alert>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import axios from "axios";
import { useRouter } from "vue-router";
import { Ref, computed, reactive, ref } from "vue";
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { Document, UploadFilled } from "@element-plus/icons-vue";
import PageResult from "@/views/PageResult.vue";

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

interface uploadCon {
  summary: string;
  content: string;
}

// 定义 jsonData 的类型
type JsonData = Chapter[];
export default {
  name: "page2",
  components: { UploadFilled },
  setup() {
    const { useStore } = require("../store/index.js");
    const store = useStore();
    const router = useRouter();
    // 使用 ref 定义单个响应式变量
    const showSuccessMessage = ref(false);
    // const topicCount = ref(0);
    // 使用 reactive 定义对象或数组等复杂响应式数据
    const questionsTypeOptions = reactive([
      { value: "choice", label: "选择题" },
      { value: "fill", label: "填空题" },
      { value: "answer", label: "简答题" },
    ]);

    const generateModeOptions = reactive([
      { value: "text", label: "根据文本内容生成" },
      { value: "open", label: "开放式生成" },
    ]);

    const difficultyLevelOptions = reactive([
      { value: "easy", label: "简单" },
      //{ value: "中等", label: "中等" },
      { value: "difficulty", label: "困难" },
    ]);

    // 使用 ref 定义单个响应式变量
    const questionType = ref("");
    const difficultyLevel = ref("");
    const generateMode = ref("");

    const drawerVisible = ref(false);
    const fileContent = ref();
    const jsonData = ref<JsonData>([]);
    const bool = ref(true); // 初始条件，可以根据需要修改
    // 计算表格宽度样式
    const tableWidthStyle = computed(() => ({
      width: bool.value ? "100%" : "60%",
      "text-align": "center",
      // marginLeft: '20px', // 设置左侧外边距为20px
      // marginRight: '20px', // 设置左侧外边距为20px
      borderRadius: "10px",
    }));
    const goToSearchPage = function () {
      router.push({
        name: "Home",
      });
    };
    const goToZujuan = function () {
      store.text = "组卷";
      router.push({
        name: "zujuan",
      });
    };

    const generateQuestions = () => {
      // 自定义上传行为
      axios
        .post(`${store.apiBaseURI}/text_generate_question`, {
          questionType: questionType.value,
          generateMode: generateMode.value,
          difficultyLevel: difficultyLevel.value,
          data: selectedContent.value,
        })
        .then((response) => {
          // 确保response.status是200，即请求成功
          if (response.status !== 200) {
            throw new Error("Network response was not ok");
          }
          console.log("response.data", response.data);
          // 清空selectedContent（可选）
          selectedContent.value = [];
          fileContent.value = response.data;
          ElMessage.success("题目生成成功！");
        })
        .catch((error) => {
          console.error(error);
          ElMessage.error("题目生成失败！");
        });
    };

    // 关闭抽屉
    const handleClose = () => {
      drawerVisible.value = false;
      bool.value = true;
      // fileContent.value = '';
    };
    const chap = store.chap || "[]";
    jsonData.value = JSON.parse(chap);
    // 处理数据
    const chapters = computed(() => {
      if (jsonData.value && jsonData.value.length > 0) {
        return jsonData.value;
      }
      // 如果没有数据，可以返回一个空数组或其他默认值
      return [];
    });
    const showTopic = (row: { expanded: boolean }) => {
      row.expanded = !row.expanded;
    };

    // 选中与取消选中知识点
    const selectedContent: Ref<uploadCon[]> = ref([]); // 用于存储选中的知识点
    const handleCheckboxChange = (
      chapter: Chapter,
      con: Con & {
        isChecked: boolean;
      }
    ) => {
      drawerVisible.value = true;
      bool.value = false;
      fileContent.value = "";
      if (con.isChecked) {
        // 如果知识点被选中，则添加到selectedContent数组中
        selectedContent.value.push({
          summary: con.point,
          content: con.text,
        });
        // console.log('selectedContentselectedContent@@',selectedContent.value)
      } else {
        // 如果知识点被取消选中，则从selectedContent数组中移除
        const index = selectedContent.value.findIndex((item) => item.summary === con.point);
        if (index !== -1) {
          selectedContent.value.splice(index, 1);
          // console.log('selectedContentselectedContent@@',selectedContent.value)
        }
      }
    };

    // 题目数量变化
    // function incrementTopic() {
    //   topicCount.value++;
    // }

    // function decrementTopic() {
    //   if (topicCount.value > 0) topicCount.value--;
    // }

    return {
      store,
      questionsTypeOptions,
      generateModeOptions,
      difficultyLevelOptions,
      questionType,
      generateMode,
      difficultyLevel,
      showSuccessMessage,
      goToSearchPage,
      // beforeUpload,
      // handleSuccess,
      // handleError,
      generateQuestions,
      // handleFileChange,
      drawerVisible,
      fileContent,
      handleClose,
      // handleExceed,
      // customUpload,
      // upload,
      chapters,
      showTopic,
      tableWidthStyle,
      bool,
      handleCheckboxChange,
      selectedContent,
      goToZujuan,
      // topicCount,
      // incrementTopic,
      // decrementTopic
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
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    color: #ffffff;
    font-weight: 700;
    font-size: 74px;
  }
  p.shifted {
    transform: translateX(-500px); /* 原页面内容左移 */
    transition: transform 0.3s; /* 平滑过渡效果 */
  }
  .p_bottom {
    position: absolute;
    top: 140px;
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
    color: white;
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
  height: 495px;
  position: relative;
  .left {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 750px;
    height: 220px;
    background-color: #b49c73;
    border-radius: 5px;

    .upload {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 180px;
      padding: 10px;
    }
    .buttons-container {
      display: flex;
      justify-content: center;
      gap: 200px; /* 添加按钮之间的间距 */
    }
    //.documentIpt_btn {
    //  //margin-right: 300px;
    //  //margin-top: 300px;
    //  width: 100px;
    //  height: 50px;
    //  background-color: wheat;
    //  border-color:wheat;
    //  color: black;
    //  font-size: 20px;
    //  font-weight: 800;
    //}
  }
  .side-panel {
    position: fixed;
    top: 5px;
    right: -100%;
    bottom: 0;
    width: 700px;
    background: #f9f9f9;
    z-index: 2;
    overflow-y: auto;
    transition: right 0.3s;
    border: 1px solid #eaeaea; /* 添加边框 */
    box-shadow: -5px 0 5px rgba(0, 0, 0, 0.2);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .choices {
      display: flex;
      gap: 20px;
    }
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
    height: 300px; /* 设置一个最小高度，以便内容能够显示 */
  }
  .auto-wrap {
    /* 强制内容在边界内换行 */
    word-wrap: break-word;
    /* 防止内容溢出容器 */
    overflow-wrap: break-word;
    white-space: pre-wrap; /* 保留空格和换行符，同时允许内容在边界内换行 */
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

  .buttons-container {
    display: flex;
    justify-content: center;
    //gap: 200px; /* 添加按钮之间的间距 */
  }
  .documentIpt_btn {
    //margin-right: 300px;
    margin-top: 20px;
    width: 425px;
    height: 40px;
    background-color: wheat;
    border-color: wheat;
    color: black;
    font-size: 20px;
    font-weight: 800;
  }
}
</style>
