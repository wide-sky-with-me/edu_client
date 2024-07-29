<script setup lang="ts">
const { useStore } = require("@/store/index.js");
import { onMounted, ref } from "vue";
import {
  ElMessage,
  genFileId,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
} from "element-plus";
import axios from "axios";
let type = ref("");
const upload = ref<UploadInstance>();
let reportResponse: any = null;
let haveReport = ref(false);

const store = useStore();

onMounted(() => {
  console.log("report page mounted");
});

const handleExceed: UploadProps["onExceed"] = (files, fileList) => {
  upload.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value?.handleStart(file);
  ElMessage.info("上传多个文件时，只上传列表第一个文件");
};

const handleDownload = () => {
  if (!reportResponse || !haveReport) {
    ElMessage.error("请先上传文件");
    return;
  }
  const { data, headers } = reportResponse;
  const contentType = headers["content-type"];
  let filename;
  let filetype;
  //如果是doc文件
  if (contentType === "application/msword") {
    filetype = "doc";
  }
  //如果是docx文件
  if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    filetype = "docx";
  }
  console.log(reportResponse);

  filename = type.value === "student" ? "学生分析报告" : "班级分析报告";
  const blob = new Blob([data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${filetype}`;
  a.click();
  window.URL.revokeObjectURL(url);

  haveReport.value = false;
  ElMessage.success("报告下载成功");
};

const handleSuccess: UploadProps["onSuccess"] = (response, file, fileList) => {
  //TODO:处理返回的doc文件
  ElMessage.success("文件上传成功");

  reportResponse = response;
  haveReport.value = true;
  upload.value?.clearFiles();
};

const handleError: UploadProps["onError"] = (err, file, fileList) => {
  ElMessage.error(`文件上传失败:${err.message}`);
};

const handleChange: UploadProps["onChange"] = (file, fileList) => {
  console.info(`
  file size: ${file.size}
  file name: ${file.name}
  `);
};
const uploadFile = (params: UploadRequestOptions) => {
  const file = params.file as UploadRawFile;
  const formData = new FormData();

  formData.append("content", file);
  const api = type.value === "student" ? "getStudentReport" : "getClassReport";
  return axios.post(`${store.reportURI}/${api}`, formData, {
    responseType: "blob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const submit = () => {
  if (type.value === "") {
    ElMessage.error("请选择报告类型");
    return;
  }
  upload.value?.submit();
};
</script>

<template>
  <el-container class="content">
    <!--内容-->
    <div class="uploadArea">
      <div class="uploadContainer">
        <h2 class="title">文件上传</h2>
        <el-upload
          class="upload"
          ref="upload"
          :auto-upload="false"
          :http-request="uploadFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :limit="1"
          accept=".json"
          :on-exceed="handleExceed"
          drag>
          <div class="el-upload-dragger">
            <el-icon
              class="el-icon--upload"
              style="margin-top: 20px"
              ><upload-filled
            /></el-icon>
            <div
              class="el-upload__text"
              style="text-align: center; font-size: 18px; font-weight: bold; margin-top: 20px">
              拖拽文件到此处上传或者<em>点击上传</em>
            </div>
          </div>
        </el-upload>
        <div class="optional">
          <span>类型选择</span>
          <el-select
            v-model="type"
            placeholder="请选择">
            <el-option
              label="学生文件"
              value="student"></el-option>
            <el-option
              label="班级文件"
              value="class"></el-option>
          </el-select>
        </div>
        <div class="footer">
          <el-button
            size="large"
            type="primary"
            @click="submit"
            >提交文件</el-button
          >
          <el-button
            size="large"
            type="primary"
            :disabled="!haveReport"
            @click="handleDownload"
            >下载报告</el-button
          >
        </div>
      </div>
    </div>
  </el-container>
</template>

<style scoped lang="less">
.content {
  background-image: url("@/assets/gr.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.5);
  .uploadArea {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .uploadContainer {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title {
        font-size: 24px;
        font-weight: bold;
        color: white;
        margin-bottom: 20px;
      }
      .optional {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 50%;
        span {
          color: white;
          padding: 0 8px;
        }
      }
      .upload {
        width: 50%;
        background-color: #ffffffc4;
      }
      .footer {
        margin-top: 20px;
        width: 50%;
        display: flex;
        justify-content: space-evenly;
        gap: 20px;
      }
    }
  }
}
</style>
