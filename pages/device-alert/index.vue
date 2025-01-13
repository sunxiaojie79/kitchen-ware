<template>
  <view class="container">
    <!-- 设备消息列表 -->
    <view class="message-list">
      <view
        class="message-item"
        v-for="(message, index) in messages"
        :key="index"
      >
        <text class="message-text">{{ message.content }}</text>
        <text class="message-time">{{ message.time }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const messages = ref([
  {
    content: "您的设备状态提醒",
    time: "2024-01-20 10:30",
  },
]);
</script>

<style>
.container {
  background-color: #000;
  min-height: 100vh;
}

.message-list {
  padding: 20rpx;
}

.message-item {
  background-color: #1a1a1a;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.message-text {
  color: #fff;
  font-size: 28rpx;
}

.message-time {
  color: #666;
  font-size: 24rpx;
  margin-top: 10rpx;
  display: block;
}
</style>
