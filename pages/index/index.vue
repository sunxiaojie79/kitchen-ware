<template>
  <view class="container">
    <!-- 设备列表区域 -->
    <view class="content">
      <view v-if="device.deviceName" class="device-list">
        <view class="device-item">
          <view class="device-info-container">
            <image class="device-icon" src="/static/global.png"></image>
            <view class="device-details">
              <text class="name-text">{{ device.deviceName }}</text>
            </view>
            <view class="device-details">
              <text class="name-text">{{ device.status }}</text>
            </view>
            <view>
              <image class="bluetooth-icon" src="/static/WIFI.png"></image>
            </view>
            <view class="device-actions">
              <button class="view-btn" @click="viewDevice(device)">
                查看設備
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";

const device = ref({});

// 显示设备名称输入框
const showDeviceNameInput = () => {
  // 获取之前保存的设备名称
  const savedDeviceName = uni.getStorageSync("userDeviceName") || "";

  uni.showModal({
    title: "請輸入設備名稱",
    editable: true,
    placeholderText: "請輸入設備名稱",
    content: savedDeviceName, // 将保存的设备名称填入输入框
    success: function (res) {
      if (res.confirm) {
        const deviceName = res.content.trim();
        // 验证设备名称是否为空
        if (deviceName) {
          // 保存设备名称
          uni.setStorageSync("userDeviceName", deviceName);
          // 调用获取设备列表
          getDevice(deviceName);
        } else {
          uni.showToast({
            title: "請輸入正確的設備名稱",
            icon: "none",
          });
          // 重新显示输入框
          setTimeout(() => {
            showPhoneNumberInput();
          }, 1500);
        }
      } else {
        // 用户点击取消，提示必须输入设备名称
        uni.showToast({
          title: "必須輸入設備名稱",
          icon: "none",
        });
        // 重新显示输入框
        setTimeout(() => {
          showPhoneNumberInput();
        }, 1500);
      }
    },
  });
};

// 页面加载时执行
onMounted(() => {
  showDeviceNameInput();
});

// getDevice 方法保持不变，但确保使用传入的 deviceName 参数
const getDevice = async (deviceName) => {
  if (!deviceName) {
    uni.showToast({
      title: "設備名稱不能為空",
      icon: "none",
    });
    return;
  }

  try {
    const res = await uni.request({
      url: `https://yczmcj.com/prod-api/device/getDeviceByDeviceName/${deviceName}`,
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    });
    if (res.data.code === 200) {
      if (res.data.data) {
        device.value = res.data.data;
      } else {
        uni.showToast({
          title: "未獲取到設備",
          icon: "none",
        });
      }
      console.log(222, device.value);
    } else {
      uni.showToast({
        title: "獲取設備失敗",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("獲取設備錯誤:", error);
    uni.showToast({
      title: "網絡請求失敗",
      icon: "none",
    });
  }
};

// 查看设备详情
const viewDevice = (device) => {
  uni.navigateTo({
    url: `/pages/device-info/index?deviceName=${encodeURIComponent(
      device.deviceName
    )}&productKey=${encodeURIComponent(
      device.productKey
    )}&deviceSecret=${encodeURIComponent(device.deviceSecret)}`,
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
  margin-bottom: 20rpx;
}
</style>
