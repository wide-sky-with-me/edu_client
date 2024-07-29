<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="25%">
        <el-row class="tac">
          <el-col :span="10">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo">
              <el-menu-item index="1">
                <template #title>
                  <el-icon>
                    <location />
                  </el-icon>
                  <span>大厅</span>
                </template>
              </el-menu-item>
              <el-menu-item index="2">
                <el-icon><icon-menu /></el-icon>
                <span>课程</span>
              </el-menu-item>
              <el-menu-item index="3">
                <el-icon>
                  <document />
                </el-icon>
                <span>比赛</span>
              </el-menu-item>
              <el-menu-item index="4">
                <el-icon>
                  <setting />
                </el-icon>
                <span>认证</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>

      <el-main style="margin-left: -13%">
        <div>
          <el-button
            type="primary"
            class="addbtn"
            @click="dialogFormVisible = true"
            >添加课程</el-button
          >
        </div>

        <div>
          <!-- <div class="block" @click="gotohome">
                      <img src="../assets/自然语言处理.jpg" />
                      <div>
                          <el-descriptions title="自然语言处理" style="width: 80%;">
                              <el-descriptions-item>自然语言处理（NLP）课程是专为学习者设计的，旨在通过一系列理论教学和实践操作介绍如何利用算法自动地理解和生成人类语言。
                                  该课程深入探讨了NLP的关键数学模型，如概率模型、向量空间模型和对数线性模型，并着重于训练学生掌握基础工具的使用，解决实际问题，以及进行工程设计和应用开发。
                                  通过课程的学习，学生将能够阅读最新科技文献，进行技术创新，并在考试或大型作业项目中展现其综合能力。</el-descriptions-item>
                          </el-descriptions>

                      </div>
                  </div>

                  <div class="block" @click="gotohome">
                      <img src="../assets/计算机组成原理.jpg" />
                      <div> <el-descriptions title="计算机组成原理" style="width: 80%;">
                              <el-descriptions-item>计算机组成原理是一门关注计算机硬件系统结构、工作原理和设计方法的课程。
                                  它涵盖了从单个硬件部件到整个计算机系统的运作机制，包括CPU、存储器、输入输出设备等关键组件的功能和互联方式。
                                  通过学习这门课程，学生能够理解计算机内部的复杂结构，掌握其工作原理，并具备设计和优化计算机系统的能力。</el-descriptions-item>

                          </el-descriptions>


                      </div>
                  </div>


                  <div class="block" @click="gotohome">
                      <img src="../assets/计算机网络.jpg" />
                      <div>
                          <el-descriptions title="计算机网络" style="width: 80%;">
                              <el-descriptions-item>计算机网络课程是一门专注于网络通信原理、设备功能及互联网应用技术的教育科目。
                                  它涉及数据在网络中的传输、路由与交换技术、网络安全和管理等核心概念。
                                  学习这门课程将帮助学生理解不同网络组件如何协同工作，并能够设计和维护大型网络系统，
                                  为现代社会中不可或缺的网络技术领域打下坚实的基础。</el-descriptions-item>
                          </el-descriptions>


                      </div>
                  </div> -->

          <div>
            <div
              class="block"
              v-for="(course, index) in courses"
              :key="index">
              <img :src="course.imgSrc" />
              <div>
                <el-descriptions
                  @click="gotoHome"
                  :title="course.title"
                  style="width: 80%">
                  <el-descriptions-item>{{ course.description }}</el-descriptions-item>
                </el-descriptions>

                <el-button
                  type="primary"
                  class="deletebtn"
                  @click="deletecourse(index)"
                  >删除课程</el-button
                >
              </div>

              <div></div>
            </div>
          </div>
        </div>

        <el-dialog
          v-model="dialogFormVisible"
          title="添加课程"
          width="500">
          <el-form :model="form">
            <el-form-item
              label="课程名称"
              :label-width="formLabelWidth">
              <el-input
                v-model="form.title"
                autocomplete="off" />
            </el-form-item>
            <el-form-item
              label="课程简介"
              :label-width="formLabelWidth">
              <el-input
                v-model="form.description"
                autocomplete="off" />
            </el-form-item>
            <el-form-item
              label="图片链接"
              :label-width="formLabelWidth">
              <el-input
                v-model="form.imgSrc"
                autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button
                type="primary"
                @click="confirm">
                确定
              </el-button>
            </div>
          </template>
        </el-dialog>

        <el-dialog
          v-model="dialogVisible"
          title="警告"
          width="500"
          :before-close="handleClose">
          <span>是否确定删除？</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button
                type="primary"
                @click="confirmdialog">
                确定
              </el-button>
            </div>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
const { useStore } = require("../store/index.js");
const store = useStore();
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";

const router = useRouter();
const dialogFormVisible = ref(false);
const dialogVisible = ref(false);
const count = ref();
const formLabelWidth = "100px";
const gotoHome = function () {
  store.text = "课程知识图谱";
  router.push({
    name: "Home",
  });
};

// const courses = ref([
//     {
//         title: '自然语言处理',
//         imgSrc: 'https://imgservice.suning.cn/uimg1/b2c/image/LFqJMv6mbvjGE8iD7x5hww.jpg_800w_800h_4e',
//         description: `自然语言处理（NLP）课程是专为学习者设计的，旨在通过一系列理论教学和实践操作介绍如何利用算法自动地理解和生成人类语言。
//         该课程深入探讨了NLP的关键数学模型，如概率模型、向量空间模型和对数线性模型，并着重于训练学生掌握基础工具的使用，解决实际问题，以及进行工程设计和应用开发。
//         通过课程的学习，学生将能够阅读最新科技文献，进行技术创新，并在考试或大型作业项目中展现其综合能力。`
//     },
//     {
//         title: '计算机组成原理',
//         imgSrc: 'https://ts1.cn.mm.bing.net/th/id/R-C.35f5a6008e8e87bfbe38e30865dacb73?rik=iWPtPFhkmbKiOg&riu=http%3a%2f%2fwww.tup.tsinghua.edu.cn%2fupload%2fbigbookimg%2f043913-01.jpg&ehk=e5KMvRiNcGfMtq36xJP4R%2bOY9tB19Bm87vyjNw%2bzyJc%3d&risl=&pid=ImgRaw&r=0',
//         description: `计算机组成原理是一门关注计算机硬件系统结构、工作原理和设计方法的课程。
//         它涵盖了从单个硬件部件到整个计算机系统的运作机制，包括CPU、存储器、输入输出设备等关键组件的功能和互联方式。
//         通过学习这门课程，学生能够理解计算机内部的复杂结构，掌握其工作原理，并具备设计和优化计算机系统的能力。`
//     },
//     {
//         title: '计算机网络',
//         imgSrc: 'https://www.phei.com.cn/covers/9787121411748.jpg',
//         description: `计算机网络课程是一门专注于网络通信原理、设备功能及互联网应用技术的教育科目。
//         它涉及数据在网络中的传输、路由与交换技术、网络安全和管理等核心概念。
//         学习这门课程将帮助学生理解不同网络组件如何协同工作，并能够设计和维护大型网络系统，
//         为现代社会中不可或缺的网络技术领域打下坚实的基础。`
//     }
// ]);

const handleClose = (done) => {
  done();
};

const courses = ref();
courses.value = store.courses;
if (sessionStorage.getItem("courselist")) {
  console.log(JSON.parse(sessionStorage.getItem("courselist"))._rawValue);

  courses.value = JSON.parse(sessionStorage.getItem("courselist"))._rawValue;
}
// console.log(JSON.parse(sessionStorage.getItem('courselist'))._rawValue)

// courses.value=JSON.parse(sessionStorage.getItem('courselist'))._rawValue

// do not use same name with ref

const form = ref({
  title: "",
  imgSrc: "",
  description: "",
});

const confirm = () => {
  console.log("submit!");
  dialogFormVisible.value = false;
  courses.value.push(form.value);

  store.courses = courses.value;
  sessionStorage.setItem("courselist", JSON.stringify(courses));
};

const deletecourse = (index) => {
  dialogVisible.value = true;

  // console.log(index)
  // courses.value.splice(index, 1);
  // sessionStorage.setItem('courselist', JSON.stringify(courses))
  count.value = index;
};

const confirmdialog = () => {
  dialogVisible.value = false;
  console.log(count.value);
  courses.value.splice(count.value, 1);
  sessionStorage.setItem("courselist", JSON.stringify(courses));
};
</script>

<style scoped>
.addbtn {
  margin-left: 90%;
}

.deletebtn {
  margin-left: 75%;
}

.block {
  margin-top: 20px;
  margin-bottom: 50px;
}

.block img {
  float: left;
  margin-right: 80px;
  /* width: auto; 自适应宽度 */
  width: 100px;
  height: 100px;
  /* 高度固定 */
  object-fit: contain;
  /* 保持图片比例 */
}

.block div {
  overflow: hidden;
}
</style>
