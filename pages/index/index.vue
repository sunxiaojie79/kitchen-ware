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

// 显示手机号输入弹框
const showPhoneNumberInput = () => {
  // 获取之前保存的手机号
  const savedPhoneNumber = uni.getStorageSync("userPhoneNumber") || "";

  uni.showModal({
    title: "請輸入手機號碼",
    editable: true,
    placeholderText: "請輸入手機號碼",
    content: savedPhoneNumber, // 将保存的手机号填入输入框
    success: function (res) {
      if (res.confirm) {
        const phoneNumber = res.content;
        // 验证手机号格式
        if (/^1[3-9]\d{9}$/.test(phoneNumber)) {
          // 保存手机号
          uni.setStorageSync("userPhoneNumber", phoneNumber);
          // 调用获取设备列表
          getDevice(phoneNumber);
        } else {
          uni.showToast({
            title: "請輸入正確的手機號碼",
            icon: "none",
          });
          // 重新显示输入框
          setTimeout(() => {
            showPhoneNumberInput();
          }, 1500);
        }
      } else {
        // 用户点击取消，提示必须输入手机号
        uni.showToast({
          title: "必須輸入手機號碼",
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
  showPhoneNumberInput();
});

// getDevice 方法保持不变，但确保使用传入的 phoneNumber 参数
const getDevice = async (phoneNumber) => {
  if (!phoneNumber) {
    uni.showToast({
      title: "手機號碼不能為空",
      icon: "none",
    });
    return;
  }

  try {
    const res = await uni.request({
      url: `http://yczmcj.com/prod-api/device/getDeviceByPhoneNumber/${phoneNumber}`,
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
