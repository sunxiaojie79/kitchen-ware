<template>
  <view class="container">
    <!-- 顶部连接状态 -->
    <view class="utilities-text">
      <text >敬請期待</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const wifi = ref({ connected: true });
const bluetooth = ref({ connected: true });
const lmet = ref({ connected: true });

const timeData = ref({
  hotpot: "21时15分",
  foot: "0时0分",
});

const waterData = ref({
  input: 999,
  output: 101,
});

const connectWifi = () => {
  // 连接WiFi逻辑
};

const deviceSettings = () => {
  // 设备设置逻辑
};
</script>

<style>
.container {
  background-color: #000;
  min-height: 100vh;
  padding: 20rpx;
}

.utilities-text {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  color:#fff;
}


</style>
