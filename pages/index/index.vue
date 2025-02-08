<template>
  <view class="container">
    <!-- 设备列表区域 -->
    <view class="content">
      <view class="device-list">
        <view v-for="device in devices" :key="device.imei" class="device-item">
          <view class="device-info-container">
            <image class="device-icon" src="/static/global.png"></image>
            <view class="device-details">
              <text class="name-text">{{ device.name }}</text>
            </view>
            <view>
              <image
                v-if="device.isConnected"
                class="bluetooth-icon"
                src="/static/WIFI.png"
              ></image>
              <text v-else class="connection-text"> 未連接 </text>
            </view>
            <view class="device-actions">
              <button class="view-btn" @click="viewDevice(device)">
                查看設備
              </button>
            </view>
          </view>
        </view>
      </view>

      <!-- 添加设备按钮 -->
      <view class="add-device">
        <button class="add-btn" @click="addDevice">添加設備</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";

const devices = ref([]);

// 获取设备列表
const getDeviceList = async () => {
  try {
    const res = await uni.request({
      url: "http://113.45.219.231:84/prod-api/device/listDevices",
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    });

    if (res.data.code === 200) {
      // 转换接口数据为页面所需格式
      devices.value = res.data.data.map((item) => ({
        name: item.deviceName,
        isConnected: item.deviceStatus === "ONLINE",
      }));
    } else {
      uni.showToast({
        title: "獲取設備列表失敗",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("獲取設備列表錯誤:", error);
    uni.showToast({
      title: "網絡請求失敗",
      icon: "none",
    });
  }
};

// 页面加载时获取设备列表
onMounted(() => {
  getDeviceList();
});

// 查看设备详情
const viewDevice = (device) => {
  uni.navigateTo({
    url: `/pages/device-info/index?deviceName=${encodeURIComponent(
      device.name
    )}`,
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
  background-color: #000;
  min-height: 100vh;
  padding: 20rpx;
}

.content {
  display: flex;
  flex-direction: column;
}

.device-list {
  flex: 1;
}

.device-item {
  background-color: #1a1a1a;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
}

.device-icon {
  width: 80rpx;
  height: 80rpx;
}

.connection-status {
  margin-left: auto;
  color: #fff;
}

.device-details {
  gap: 10rpx;
}
.device-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
}

.name-text {
  width: 100%;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
}
.connection-text {
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
  background-color: #2467b0;
  color: #fff;
  font-size: 24rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  min-width: 120rpx;
}

.add-device {
  margin-top: 20rpx;
}

.add-btn {
  background-color: #1a1a1a;
  color: #fff;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 32rpx;
}
</style>
