<template>
  <view class="container">
    <!-- 设备列表区域 -->
    <view class="device-list">
      <view v-for="device in devices" :key="device.imei" class="device-item">
        <view class="name-text"><text>{{device.name}}</text></view>
		<view class="device-info-container">
          <image class="device-icon" src="/static/global.png"></image>
          <view class="device-details">
            <text class="ip-text">IP：{{ device.ip }}</text>
            <text class="imei-text">IMEI：{{ device.imei }}</text>
          </view>
          <view class="device-actions">
            <button class="view-btn" @click="viewDevice(device)">
              查看设备
            </button>
            <image
              v-if="device.isConnected"
              class="bluetooth-icon"
              src="/static/WIFI.png"
            ></image>
            <text v-else class="connection-text"> 未连接 </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加设备按钮 -->
    <view class="add-device">
      <button class="add-btn" @click="addDevice">添加設備</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const deviceInfo = ref({
  ip: "192.168.1.1",
  id: "Device001",
});

const isConnected = ref(true);

// 设备列表数据
const devices = ref([
  {
	  name:"智能蒸鍋",
    ip: "192.168.1.100",
    imei: "123456789012345",
    isConnected: true,
  },
  {
	  name:"智能掃地機",
    ip: "192.168.1.101",
    imei: "987654321098765",
    isConnected: false,
  },
]);

// 查看设备详情
const viewDevice = (device) => {
  uni.navigateTo({
    url: `/pages/device-info/index?imei=${device.imei}`,
  });
};

// 添加设备
const addDevice = () => {
  uni.navigateTo({
    url: "/pages/device-add/index",
  });
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000;
}

.device-icon {
  width: 80rpx;
  height: 80rpx;
}

.connection-status {
  margin-left: auto;
  color: #fff;
}

/* 设备列表样式 */
.device-list {
  flex: 1;
  padding: 20rpx;
}

.device-item {
  background-color: #1a1a1a;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
}
.name-text{
	width: 100%;
	color: #fff;
	text-align: center;
	font-size: 32rpx;
}
.device-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.connection-text,
.ip-text,
.imei-text {
  color: #fff;
  font-size: 28rpx;
}

.device-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.bluetooth-icon {
  width: 40rpx;
  height: 40rpx;
}

.view-btn {
  background-color: #007aff;
  color: #fff;
  font-size: 24rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  min-width: 120rpx;
}

/* 添加设备按钮样式 */
.add-device {
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.add-btn {
  background-color: #1a1a1a;
  color: #fff;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 10rpx;
}
</style>
