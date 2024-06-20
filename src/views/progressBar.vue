<template>
  <div class="progress-bar">
    <div class="progress" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script>
export default {
  setup() {
    const progress = ref(0);

    // 提交数据的逻辑代码...
    // 在提交数据时更新进度条的宽度
    const updateProgress = (newProgress) => {
      progress.value = newProgress;
    };

    return { progress, updateProgress };
  },
};
</script>

<style>
.progress-bar {
  width: 100%;
  background-color: #f3f3f3;
}

.progress {
  height: 20px;
  background-color: #4caf50;
}
</style>