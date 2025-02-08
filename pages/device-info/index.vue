<template>
  <view class="container">
    <!-- 上部分 -->
    <view class="top-section section">
      <image class="device-icon" src="/static/device.png"></image>
      <view class="icon-wrapper">
        <view
          class="icon-row"
          hover-class="none"
          hover-stop-propagation="false"
        >
          <image class="icon-wifi" src="/static/WIFI.png"></image>
          <image class="icon-bluetooth" src="/static/bluetooth.png"></image>
          <view class="icon-text">IMEI</view>
        </view>
        <view class="connect-btn">藍牙連接</view>
      </view>
    </view>

    <!-- 中部设备数据 -->
    <view class="section">
      <view class="data-title">設備數據</view>
      <view class="data-section">
        <view
          class="data-item"
          v-for="(item, index) in deviceData"
          :key="index"
        >
          <view class="data-content">
            <text class="label">{{ item.label }}</text>
            <view class="value">
              <template
                v-for="(part, index) in splitValue(item.value)"
                :key="index"
              >
                <text :class="{ number: isNumber(part) }">{{ part }}</text>
              </template>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 下部分高级设置 -->
    <view class="section">
      <view class="data-title">高級設置</view>
      <view class="advanced-settings">
        <view class="setting-item" @click="connectWifi">
          <view
            class="setting-item-content"
            hover-class="none"
            hover-stop-propagation="false"
          >
            <text>連接WIFI</text>
            <image class="icon" src="/static/WIFI.png"></image>
          </view>
        </view>

        <view class="setting-item" @click="deviceSettings">
          <view
            class="setting-item-content"
            hover-class="none"
            hover-stop-propagation="false"
          >
            <text>設備解綁</text>
            <image class="icon" src="/static/link_delete.png"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";

const deviceData = ref([]);

// 获取设备详情数据
const getDeviceInfo = async (deviceName) => {
  try {
    const res = await uni.request({
      url: `http://113.45.219.231:84/prod-api/device/deviceProp`,
      method: "GET",
      data: {
        deviceName: deviceName,
      },
      header: {
        "Content-Type": "application/json",
      },
    });
    console.log(111, res.data);
    if (res.data.code === 200) {
      // 转换数据为显示格式
      deviceData.value = [
        { label: "火種時間", value: `${res.data.data.sparkFireWorkMinutes}分` },
        { label: "細火時間", value: `${res.data.data.smallFireWorkMinutes}分` },
        { label: "大火時間", value: `${res.data.data.bigFireWorkMinutes}分` },
        { label: "環保火時間", value: `${res.data.data.epFireWorkMinutes}分` },
        { label: "進水量", value: `${res.data.data.inflowWater}立方` },
        { label: "排水次數", value: `${res.data.data.drainCount}次` },
      ];
    } else {
      uni.showToast({
        title: "獲取設備詳情失敗",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("獲取設備詳情錯誤:", error);
    uni.showToast({
      title: "網絡請求失敗",
      icon: "none",
    });
  }
};

// 页面加载时获取设备详情
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const deviceName = decodeURIComponent(currentPage.$page.options.deviceName);

  if (deviceName) {
    getDeviceInfo(deviceName);
  }
});

// 分离数字和非数字
const splitValue = (value) => {
  return value.split(/(\d+)/).filter(Boolean);
};

const isNumber = (str) => {
  return /^\d+$/.test(str);
};

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
  gap: 20rpx;
}

.section {
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  background-color: #1a1a1a;
  padding: 20rpx;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
}

.device-icon {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 60rpx;
}
.icon-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.icon-row {
  display: flex;
  justify-content: space-around;
  width: 40%;
}

.icon-wifi {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.icon-bluetooth {
  width: 44rpx;
  height: 60rpx;
  margin-right: 20rpx;
}
.icon-text {
  color: #fff;
  font-size: 32rpx;
  height: 60rpx;
  line-height: 60rpx;
  background-color: #636568;
  padding: 0 20rpx;
}
.connect-btn {
  background-color: #2467b0;
  color: #fff;
  font-size: 32rpx;
  padding: 10rpx 40rpx;
  border-radius: 6rpx;
  margin-right: 20rpx;
}
.data-title {
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}
.data-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.data-item {
  width: 45%;
  border: 1px solid #ccc;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120rpx;
}

.data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10rpx 0;
}

.label {
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 8rpx;
  text-align: center;
}

.value {
  font-size: 32rpx;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
}

.value .number {
  color: #ffb800;
  font-weight: bold;
}

.advanced-settings {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item {
  background-color: #1a1a1a;
  color: #fff;
  border-radius: 10rpx;
  text-align: center;
  width: 45%;
  border: 1px solid #ccc;
  gap: 10rpx;
}
.setting-item-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10rpx 20rpx;
  justify-content: space-between;
  gap: 10rpx;
}
.setting-item text {
  font-size: 32rpx;
}

.icon {
  width: 60rpx;
  height: 60rpx;
}
</style>
