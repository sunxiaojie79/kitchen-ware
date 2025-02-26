<template>
  <view class="container">
    <view class="header">
      <text class="title">搜索設備中...</text>
      <text class="subtitle">請確保設備處於配對模式</text>
    </view>

    <view class="device-list">
      <view
        v-for="device in bluetoothDevices"
        :key="device.deviceId"
        class="device-item"
        @tap="connectDevice(device)"
      >
        <view class="device-info">
          <text class="device-name">{{ device.name }}</text>
          <text class="device-id">{{ device.deviceId }}</text>
        </view>
        <text class="rssi">信號: {{ device.RSSI }}dBm</text>
      </view>
    </view>

    <!-- WiFi信息输入弹框 -->
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        mode="input"
        title="Wi-Fi信息"
        :before-close="true"
        @close="handleClose"
        @confirm="handleConfirm"
      >
        <view class="wifi-input-container">
          <input
            class="wifi-input"
            v-model="SSID"
            placeholder="請輸入Wi-Fi賬號"
            type="text"
          />
          <input
            class="wifi-input"
            v-model="Password"
            placeholder="請輸入Wi-Fi密碼"
            type="text"
          />
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const popup = ref(null);
const bluetoothDevices = ref([]);
const SSID = ref("");
const Password = ref("");
const isBluetoothInitialized = ref(false);

// 存储产品密钥和设备名称
const productKey = ref("");
const deviceSecret = ref("");
const deviceName = ref("");

// 显示 WiFi 信息输入弹框
const showWiFiInput = async () => {
  // 等待组件挂载完成
  await nextTick();

  // 获取之前保存的 WiFi 信息
  SSID.value = uni.getStorageSync("wifiSSID") || "";
  Password.value = uni.getStorageSync("wifiPassword") || "";

  // 显示弹框
  if (popup.value) {
    popup.value.open();
  }
};

// 处理确认按钮
const handleConfirm = () => {
  if (!SSID.value || !Password.value) {
    uni.showToast({
      title: "Wi-Fi賬號和密碼不能為空",
      icon: "none",
    });
    return;
  }

  // 保存 WiFi 信息
  uni.setStorageSync("wifiSSID", SSID.value);
  uni.setStorageSync("wifiPassword", Password.value);

  // 关闭弹框
  popup.value.close();

  // 开始蓝牙初始化
  initBluetooth();
};

// 处理取消按钮
const handleClose = () => {
  // 返回上一页
  uni.navigateBack();
};

// 初始化蓝牙模块
const initBluetooth = () => {
  uni.openBluetoothAdapter({
    success: (res) => {
      console.log("蓝牙初始化成功:", res);
      isBluetoothInitialized.value = true;
      startBluetoothDevicesDiscovery();
    },
    fail: (error) => {
      console.error("蓝牙初始化失败:", error);
      isBluetoothInitialized.value = false;
      uni.showToast({
        title: "請開啟藍牙",
        icon: "none",
      });
    },
  });
};

// 开始搜索蓝牙设备
const startBluetoothDevicesDiscovery = () => {
  uni.startBluetoothDevicesDiscovery({
    success: () => {
      // 监听寻找到新设备的事件
      uni.onBluetoothDeviceFound((res) => {
        console.log("发现新设备:", res);
        res.devices.forEach((device) => {
          if (
            device.name &&
            !bluetoothDevices.value.some((d) => d.deviceId === device.deviceId)
          ) {
            bluetoothDevices.value.push(device);
          }
        });
      });
    },
    fail: (error) => {
      console.error("搜索蓝牙设备失败:", error);
      uni.showModal({
        title: "搜索設備失敗" + error.errCode + error.errMsg,
        icon: "none",
      });
    },
  });
};

// 连接设备
const connectDevice = (device) => {
  uni.createBLEConnection({
    deviceId: device.deviceId,
    success: (res) => {
      uni.showToast({
        title: "連接成功",
        icon: "success",
      });
      console.log("🚀 ~ connectDevice ~ res:", res);
      getServices(device);
      // 这里可以添加设备到后端
      // uni.navigateTo({
      //   url: "/pages/index/index",
      // });
    },
    fail: (error) => {
      console.error("连接失败:", error);
      uni.showToast({
        title: "連接失敗",
        icon: "none",
      });
    },
  });
};

// 获取服务
const getServices = (device) => {
  uni.getBLEDeviceServices({
    deviceId: device.deviceId,
    success: (res) => {
      console.log("🚀 ~ getServices ~ res:", res);
      getCharacteristics(device, res.services[0].uuid);
    },
    fail: (error) => {
      console.error("获取服务失败:", error);
    },
  });
};

// 获取特征值
const getCharacteristics = (device, serviceId) => {
  uni.getBLEDeviceCharacteristics({
    deviceId: device.deviceId,
    serviceId,
    success: (res) => {
      console.log("🚀 ~ getCharacteristics ~ res:", res);
      let writeCharacteristicId = "";
      res.characteristics.forEach((characteristic) => {
        if (characteristic.properties.write) {
          writeCharacteristicId = characteristic.uuid;
        }
      });
      console.log(
        "🚀 ~ getCharacteristics ~ writeCharacteristicId:",
        writeCharacteristicId
      );
      sendData(device, serviceId, writeCharacteristicId);

      // startNotify(device, serviceId, writeCharacteristicId);
    },
    fail: (error) => {
      console.error("获取特征值失败:", error);
    },
  });
};

// 开启消息监听
const startNotify = (device, serviceId, characteristicId) => {
  uni.notifyBLECharacteristicValueChange({
    deviceId: device.deviceId,
    serviceId,
    characteristicId,
    state: true,
    success: (res) => {
      console.log("🚀 ~ startNotify ~ res:", res);
      // 接收消息的方法
      listenValueChange();
      // 发送数据
      sendData(device, serviceId, characteristicId);
    },
    fail: (error) => {
      console.error("开启消息监听失败:", error);
    },
  });
};

// 监听消息变化
const listenValueChange = () => {
  uni.onBLECharacteristicValueChange((res) => {
    console.log("🚀 ~ listenValueChange ~ res:", res);
    // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
    let resHex = ab2hex(res.value);
    console.log(resHex);
    // 最后将16进制转换为ascii码，就能看到对应的结果
    let result = hexCharCodeToStr(resHex);
    console.log("🚀 ~ uni.onBLECharacteristicValueChange ~ result:", result);
  });
};

// 将 ArrayBuffer 转换为16进制
const ab2hex = (buffer) => {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ("00" + bit.toString(16)).slice(-2);
    }
  );
  return hexArr.join("");
};

// 将16进制转换为ascii码
const hexCharCodeToStr = (hexCharCodeStr) => {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x"
      ? trimedStr.substr(2)
      : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    console("存在非法字符!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
};

// 发送数据
const sendData = (device, serviceId, characteristicId) => {
  const msg = `SSID:${SSID.value};Password:${Password.value};ProductKey:${productKey.value};DeviceName:${deviceName.value};DeviceSecret:${deviceSecret.value};`;
  const buffer = new ArrayBuffer(msg.length);
  const dataView = new DataView(buffer);
  // dataView.setUint8(0, 0)

  for (var i = 0; i < msg.length; i++) {
    dataView.setUint8(i, msg.charAt(i).charCodeAt());
  }
  uni.writeBLECharacteristicValue({
    deviceId: device.deviceId,
    serviceId,
    characteristicId,
    value: buffer,
    success: (res) => {
      console.log("🚀 ~ sendData ~ res:", res);
      uni.showToast({
        title: "发送数据成功",
        icon: "success",
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1000);
    },
    fail: (error) => {
      console.error("发送数据失败:", error);
    },
  });
};

// 页面加载时执行
onMounted(async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];

  // 获取路由参数
  productKey.value = decodeURIComponent(currentPage.options.productKey || "");
  deviceSecret.value = decodeURIComponent(
    currentPage.options.deviceSecret || ""
  );
  deviceName.value = decodeURIComponent(currentPage.options.deviceName || "");

  await showWiFiInput();
});

// 页面卸载时清理蓝牙
onUnmounted(() => {
  if (isBluetoothInitialized.value) {
    uni.stopBluetoothDevicesDiscovery();
    uni.closeBluetoothAdapter();
  }
});
</script>

<style>
.container {
  background-color: #000;
  min-height: 100vh;
  padding: 20rpx;
}

.header {
  padding: 40rpx 0;
  text-align: center;
}

.title {
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 10rpx;
}

.subtitle {
  color: #999;
  font-size: 28rpx;
}

.device-list {
  margin-top: 40rpx;
}

.device-item {
  background-color: #1a1a1a;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.device-name {
  color: #fff;
  font-size: 32rpx;
}

.device-id {
  color: #999;
  font-size: 24rpx;
}

.rssi {
  color: #666;
  font-size: 24rpx;
}

.wifi-input-container {
  padding: 15rpx;
}

.wifi-input {
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 15rpx;
  margin-bottom: 20rpx;
  width: 100%;
  box-sizing: border-box;
  height: 100rpx;
}

/* 最后一个输入框不需要底部间距 */
.wifi-input:last-child {
  margin-bottom: 0;
}
</style>
