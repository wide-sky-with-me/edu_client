import { defineStore } from "pinia";
export const useStore = defineStore("main", {
  state: () => {
    return {
      // 首页显示文本
      text: "课程知识图谱",
      chap: "",
      apiBaseURI: "http://43.138.59.170:6011",
      elementExtraction: {},
    };
  },
  actions: {
    caseSearchResultTempFun(value) {
      this.caseSearchResultTemp = value;
      this.caseSearchResult = this.caseSearchResultTemp;
    },
  },
});
