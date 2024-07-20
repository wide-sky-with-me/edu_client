<template>
  <el-container class="documentIpt_all">
    <el-header
      class="documentIpt_header"
      height="180px">
      <p>{{ store.text }}</p>
      <el-breadcrumb
        class="p_bottom"
        separator=">>">
        <el-breadcrumb-item :to="{ path: '/' }">HOME</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'documentIpt' }">FILE-UPLOAD</el-breadcrumb-item>
        <el-breadcrumb-item>FILE-PREVIEW</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="documentIpt_main">
      <el-card class="box-card">
        <template v-slot:header>
          <div class="card-header">
            <span class="title">知识点显示</span>
            <el-button
              class="button"
              type="primary"
              :icon="Plus"
              @click="addform()"
              >添加知识点</el-button
            >
          </div>
        </template>

        <el-table
          style="width: 100%; text-align: center"
          empty-text="没有数据"
          :data="chapters">
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
                    {{ con.point }}
                    <el-popconfirm
                      title="确定要删除吗？"
                      confirmButtonText="确定"
                      cancelButtonText="取消"
                      @confirm="confirmDelete(row, con)">
                      <template v-slot:reference>
                        <el-button
                          link
                          type="primary"
                          size="small"
                          style="float: right"
                          >删除</el-button
                        >
                      </template>
                    </el-popconfirm>
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="changedata(row, con)"
                      style="float: right"
                      >修改</el-button
                    >
                  </li>
                </ul>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog
        v-model="dialogFormVisible"
        title="知识点修改">
        <el-form
          :model="form"
          label-width="auto"
          style="max-width: 500px">
          <el-form-item label="知识点">
            <el-input v-model="form.topicPoint" />
          </el-form-item>
          <el-form-item label="文本">
            <el-input v-model="form.topicText" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit()"
              >确定</el-button
            >
            <el-button @click="onCancle">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        v-model="dialogFormVisible2"
        title="知识点增加">
        <el-form
          :model="form2"
          label-width="auto"
          style="max-width: 500px">
          <!--          <el-form-item label="章节名">-->
          <!--            <el-input v-model="form2.title" />-->
          <!--          </el-form-item>-->
          <el-form-item label="章节名">
            <el-select
              v-model="form2.title"
              placeholder="请选择章节"
              style="width: 400px">
              <el-option
                v-for="chapter in chapters"
                :key="chapter.title"
                :label="chapter.title"
                :value="chapter.title">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="知识点">
            <el-input
              style="width: 400px"
              v-model="form2.point" />
          </el-form-item>
          <el-form-item label="文本">
            <el-input
              style="width: 400px"
              v-model="form2.text" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="addtechnology()"
              >确定</el-button
            >
            <el-button @click="onCancle2">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    <el-footer class="documentIpt_footer">
      <div class="buttons-container">
        <el-button
          size="large"
          type="primary"
          class="documentIpt_btn"
          @click="downloadJson"
          >下载文档</el-button
        >
        <!--        <el-button size="large" type="primary" class="documentIpt_btn" @click="gotodisplayGraph" >展示图谱</el-button>-->
        <el-button
          size="large"
          type="primary"
          class="documentIpt_btn"
          @click="goToDocumentIptPage"
          >返回</el-button
        >
      </div>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
//TODO:文件重构

//REVIEW 这是一个测试数据，注意在实际使用时删除
// import jsonSTR from "@/static/response.json";

import { computed, onMounted, reactive, ref, unref, UnwrapRef } from "vue";
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { Document, Plus, UploadFilled } from "@element-plus/icons-vue";
import DocumentIpt from "@/views/DocumentIpt.vue";
import axios from "axios";

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
  name: "ShowDocument",
  computed: {
    Plus() {
      return Plus;
    },
  },
  components: { Document, UploadFilled },
  setup() {
    const { useStore } = require("../store/index.js");
    const store = useStore();
    const router = useRouter();
    // const data = ref<string[]>([]);
    const jsonData = ref<JsonData>([]);
    const dialogFormVisible = ref(false);
    const dialogFormVisible2 = ref(false);
    const form = reactive({
      chapterIndex: -1,
      topicIndex: -1,
      topicPoint: "",
      topicText: "",
    });
    const form2 = reactive({
      title: "",
      point: "",
      text: "",
    });

    //返回上层
    const goToDocumentIptPage = function () {
      store.text = "文档知识点抽取";
      router.push({
        name: "DocumentIpt",
      });
    };

    const show = () => {
      console.log("click");
    };

    const confirmDelete = (chapter: Chapter, con: Con) => {
      // 在确认删除时调用删除函数
      deleatedata(chapter, con);
    };

    // 删除知识点
    const deleatedata = (chapter: Chapter, con: Con) => {
      console.log("delete");
      console.log("row", chapter);
      console.log("value", con);

      // 找到包含要删除的知识点的章节
      const chapterIndex = jsonData.value.findIndex((item) => item.title === chapter.title);
      if (chapterIndex >= 0) {
        // 如果找到章节，则从章节数据中移除对应的知识点
        console.log("@@@", jsonData.value[chapterIndex].content);
        // jsonData.value[chapterIndex].topics = jsonData.value[chapterIndex].topics.filter((currentTopic: any) => currentTopic !== topic);
        jsonData.value[chapterIndex].content.forEach((currentTopic, index) => {
          // console.log('11111111111111')
          // console.log(currentTopic)
          // console.log(value)
          if (currentTopic.point === con.point) {
            console.log("index", index);
            jsonData.value[chapterIndex].content.splice(index, 1);
            // console.log('###',jsonData.value[chapterIndex].content )
          }
        });
        // 如果删除知识点后，content为空，则删除整个章节
        if (jsonData.value[chapterIndex].content.length === 0) {
          jsonData.value.splice(chapterIndex, 1);
        }
        // 执行其他逻辑，如通知用户操作成功
        console.log("Topic deleted:", con);
      } else {
        // 如果没有找到章节，则可能是因为章节数据已经发生变化
        console.error("Topic not found in chapters:", con);
      }
      //true表示已经经历过修改
      const jsonData1 = JSON.stringify(jsonData.value);
      store.chap = jsonData1;
      console.log("删除后的store.chap", store.chap);
      sessionStorage.setItem("flag", "true");
      sessionStorage.setItem("data", JSON.stringify(jsonData.value));
    };
    // 打开修改弹框
    const changedata = (chapter: Chapter, con: Con) => {
      const { point, text } = con;
      console.log("chapter", chapter);
      console.log("con", con);

      console.log("change");
      dialogFormVisible.value = true;
      // 找到章节和知识点的索引
      form.chapterIndex = jsonData.value.findIndex((chapter) => chapter.title === chapter.title);
      form.topicIndex = chapter.content.findIndex((cont: Con) => cont.point == point);

      // 设置表单的初始值
      form.topicPoint = point;
      form.topicText = text;
      console.log("chapterIndex", form.chapterIndex);
      console.log("topicIndex", form.topicIndex);
      console.log("topicPoint", form.topicPoint);
      console.log("topicText", form.topicText);
    };
    // 打开添加弹框
    const addform = () => {
      dialogFormVisible2.value = true;
    };

    // 添加知识点
    const addtechnology = () => {
      const { title, point, text } = form2;

      // 在现有的章节数组中查找是否有与用户输入的章节名匹配的章节
      const existingChapter = jsonData.value.find((chapter) => chapter.title === title);
      // 检查 value 是否为空
      if (!point) {
        alert("知识点内容不能为空");
        return; // 或者你可以选择其他方式来终止函数的执行
      }
      if (!text) {
        alert("文本内容不能为空");
        return;
      }
      // 如果找到了匹配的章节，则将新的知识点添加到该章节的 topics 数组中
      if (existingChapter) {
        existingChapter.content.push({
          point: point,
          text: text,
        });
      } else {
        alert("请选择章节名");
        return; // 或者你可以选择其他方式来终止函数的执行
      }
      const jsonData1 = JSON.stringify(jsonData.value);
      store.chap = jsonData1;
      console.log("添加后的store.chap", store.chap);
      sessionStorage.setItem("data", JSON.stringify(jsonData.value));
      sessionStorage.setItem("flag", "true");
      dialogFormVisible2.value = false;
    };
    const onCancle2 = () => {
      //清除表单数据
      form2.title = "";
      form2.point = "";
      dialogFormVisible2.value = false;
    };
    // 修改知识点
    const onSubmit = function () {
      const { chapterIndex, topicIndex, topicPoint, topicText } = form;
      if (chapterIndex !== -1 && topicIndex !== -1) {
        // 更新知识点的内容
        // 检查 value 是否为空字符串
        if (topicPoint === "") {
          alert("知识点内容不能为空");

          return; // 或者你可以选择其他方式来终止函数的执行
        }
        jsonData.value[chapterIndex].content[topicIndex] = {
          point: topicPoint,
          text: topicText,
        };
        const jsonData1 = JSON.stringify(jsonData.value);
        store.chap = jsonData1;
        console.log("修改后的store.chap", store.chap);
        sessionStorage.setItem("data", JSON.stringify(jsonData.value));
        sessionStorage.setItem("flag", "true");
        dialogFormVisible.value = false;
      }
    };
    const onCancle = function () {
      dialogFormVisible.value = false;
    };

    const route = useRoute();
    const responseContent = ref<string[]>([]);

    onMounted(() => {
      if (sessionStorage.getItem("flag") == "true") {
        console.log("@@@@111");
        const storedData = sessionStorage.getItem("data");
        if (storedData !== null) {
          try {
            // 尝试解析存储的数据，并将其赋值给 data.value
            jsonData.value = JSON.parse(storedData);
          } catch (error) {
            console.error("Error parsing stored data:", error);
          }
        } else {
          console.warn("No data found in sessionStorage");
        }
      } else {
        //WARN 这是测试操作
        const jsonDataString = route.query.jsonData;
        // const jsonDataString = JSON.stringify(jsonSTR);

        //REVIEW 这行代码是为了测试，实际使用时应该删除
        // store.chap = jsonDataString;

        if (typeof jsonDataString === "string" && jsonDataString) {
          try {
            jsonData.value = JSON.parse(jsonDataString);
            console.log("Received JSON data:", jsonData.value);
          } catch (error) {
            console.error("Error parsing JSON data:", error);
          }
        }

        console.log(jsonData.value);
      }
      //true表示已经经历过修改
      // sessionStorage.setItem("flag", "true");
    });

    // 下载知识点文档
    const downloadJson = () => {
      // 创建一个文本字符串，每个对象占据一行
      let textString = jsonData.value
        .map((chapter) => {
          // 将章节标题和知识点内容拼接为一行文本
          return (
            chapter.title +
            "\n" +
            chapter.content
              .map((con) => {
                return con.point;
              })
              .join("\n")
          );
        })
        .join("\n");

      // 将文本字符串转换为Blob对象
      const blob = new Blob([textString], { type: "text/plain" });

      // 创建一个URL指向该Blob对象
      const url = URL.createObjectURL(blob);

      // 创建一个<a>标签并模拟点击以下载文件
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.txt"; // 设置下载的文件名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 释放URL对象
      URL.revokeObjectURL(url);
    };

    // 处理数据
    const chapters = computed(() => {
      if (jsonData.value && jsonData.value.length > 0) {
        return jsonData.value;
      }
      // 如果没有数据，可以返回一个空数组或其他默认值
      return [];
    });

    // 切换章节内容展开和收起
    const showTopic = (row: { expanded: boolean }) => {
      row.expanded = !row.expanded;
    };

    return {
      store,
      goToDocumentIptPage,
      downloadJson,
      responseContent,
      dialogFormVisible,
      dialogFormVisible2,
      form,
      form2,
      confirmDelete,
      changedata,
      addform,
      addtechnology,
      onCancle2,
      onSubmit,
      onCancle,
      show,
      showTopic,
      chapters,
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
}
.documentIpt_main {
  padding: 0;
  height: 100%;
  position: relative;
  .box-card {
    border-radius: 1rem;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 24px;
      }
    }
  }
}
.documentIpt_footer {
  height: 150px;
  .buttons-container {
    display: flex;
    justify-content: center;
    row-gap: 200px;
  }
  .documentIpt_btn {
    //margin-right: 300px;
    //margin-top: 550px;
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
