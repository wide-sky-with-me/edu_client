import { defineStore } from "pinia";
export const useStore = defineStore("main", {
  state: () => {
    return {
      // 首页显示文本
      text: "课程知识图谱",
      chap: "",
      apiBaseURI: "http://127.0.0.1:5000",
      reportURI: "http://127.0.0.1:5000",
      elementExtraction: {},

      courses: [
        {
          title: "自然语言处理",
          imgSrc:
            "https://imgservice.suning.cn/uimg1/b2c/image/LFqJMv6mbvjGE8iD7x5hww.jpg_800w_800h_4e",
          description: `自然语言处理（NLP）课程是专为学习者设计的，旨在通过一系列理论教学和实践操作介绍如何利用算法自动地理解和生成人类语言。
            该课程深入探讨了NLP的关键数学模型，如概率模型、向量空间模型和对数线性模型，并着重于训练学生掌握基础工具的使用，解决实际问题，以及进行工程设计和应用开发。
            通过课程的学习，学生将能够阅读最新科技文献，进行技术创新，并在考试或大型作业项目中展现其综合能力。`,
        },
        {
          title: "计算机组成原理",
          imgSrc:
            "https://ts1.cn.mm.bing.net/th/id/R-C.35f5a6008e8e87bfbe38e30865dacb73?rik=iWPtPFhkmbKiOg&riu=http%3a%2f%2fwww.tup.tsinghua.edu.cn%2fupload%2fbigbookimg%2f043913-01.jpg&ehk=e5KMvRiNcGfMtq36xJP4R%2bOY9tB19Bm87vyjNw%2bzyJc%3d&risl=&pid=ImgRaw&r=0",
          description: `计算机组成原理是一门关注计算机硬件系统结构、工作原理和设计方法的课程。
            它涵盖了从单个硬件部件到整个计算机系统的运作机制，包括CPU、存储器、输入输出设备等关键组件的功能和互联方式。
            通过学习这门课程，学生能够理解计算机内部的复杂结构，掌握其工作原理，并具备设计和优化计算机系统的能力。`,
        },
        {
          title: "计算机网络",
          imgSrc: "https://www.phei.com.cn/covers/9787121411748.jpg",
          description: `计算机网络课程是一门专注于网络通信原理、设备功能及互联网应用技术的教育科目。
            它涉及数据在网络中的传输、路由与交换技术、网络安全和管理等核心概念。
            学习这门课程将帮助学生理解不同网络组件如何协同工作，并能够设计和维护大型网络系统，
            为现代社会中不可或缺的网络技术领域打下坚实的基础。`,
        },
      ],
    };
  },
  actions: {
    caseSearchResultTempFun(value) {
      this.caseSearchResultTemp = value;
      this.caseSearchResult = this.caseSearchResultTemp;
    },
  },
});
