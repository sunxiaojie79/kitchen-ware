"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const popup = common_vendor.ref(null);
    const bluetoothDevices = common_vendor.ref([]);
    const SSID = common_vendor.ref("");
    const Password = common_vendor.ref("");
    const isBluetoothInitialized = common_vendor.ref(false);
    const productKey = common_vendor.ref("");
    const deviceSecret = common_vendor.ref("");
    const deviceName = common_vendor.ref("");
    const showWiFiInput = async () => {
      await common_vendor.nextTick$1();
      SSID.value = common_vendor.index.getStorageSync("wifiSSID") || "";
      Password.value = common_vendor.index.getStorageSync("wifiPassword") || "";
      if (popup.value) {
        popup.value.open();
      }
    };
    const handleConfirm = () => {
      if (!SSID.value || !Password.value) {
        common_vendor.index.showToast({
          title: "Wi-Fi賬號和密碼不能為空",
          icon: "none"
        });
        return;
      }
      common_vendor.index.setStorageSync("wifiSSID", SSID.value);
      common_vendor.index.setStorageSync("wifiPassword", Password.value);
      popup.value.close();
      initBluetooth();
    };
    const handleClose = () => {
      common_vendor.index.navigateBack();
    };
    const initBluetooth = () => {
      common_vendor.index.openBluetoothAdapter({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/device-add/index.vue:111", "蓝牙初始化成功:", res);
          isBluetoothInitialized.value = true;
          startBluetoothDevicesDiscovery();
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/device-add/index.vue:116", "蓝牙初始化失败:", error);
          isBluetoothInitialized.value = false;
          common_vendor.index.showToast({
            title: "請開啟藍牙",
            icon: "none"
          });
        }
      });
    };
    const startBluetoothDevicesDiscovery = () => {
      common_vendor.index.startBluetoothDevicesDiscovery({
        success: () => {
          common_vendor.index.onBluetoothDeviceFound((res) => {
            common_vendor.index.__f__("log", "at pages/device-add/index.vue:132", "发现新设备:", res);
            res.devices.forEach((device) => {
              if (device.name && !bluetoothDevices.value.some((d) => d.deviceId === device.deviceId)) {
                bluetoothDevices.value.push(device);
              }
            });
          });
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/device-add/index.vue:144", "搜索蓝牙设备失败:", error);
          common_vendor.index.showModal({
            title: "搜索設備失敗" + error.errCode + error.errMsg,
            icon: "none"
          });
        }
      });
    };
    const connectDevice = (device) => {
      common_vendor.index.createBLEConnection({
        deviceId: device.deviceId,
        success: (res) => {
          common_vendor.index.showToast({
            title: "連接成功",
            icon: "success"
          });
          common_vendor.index.__f__("log", "at pages/device-add/index.vue:162", "🚀 ~ connectDevice ~ res:", res);
          common_vendor.index.setBLEMTU({
            deviceId: device.deviceId,
            mtu: 200,
            success: (res2) => {
              common_vendor.index.__f__("log", "at pages/device-add/index.vue:167", "🚀 ~ setBLEMTU ~ res:", res2);
              getServices(device);
            },
            fail: (error) => {
              common_vendor.index.__f__("error", "at pages/device-add/index.vue:171", "设置MTU失败:", error);
            }
          });
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/device-add/index.vue:180", "连接失败:", error);
          common_vendor.index.showToast({
            title: "連接失敗",
            icon: "none"
          });
        }
      });
    };
    const getServices = (device) => {
      common_vendor.index.getBLEDeviceServices({
        deviceId: device.deviceId,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/device-add/index.vue:194", "🚀 ~ getServices ~ res:", res);
          getCharacteristics(device, res.services[0].uuid);
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/device-add/index.vue:198", "获取服务失败:", error);
        }
      });
    };
    const getCharacteristics = (device, serviceId) => {
      common_vendor.index.getBLEDeviceCharacteristics({
        deviceId: device.deviceId,
        serviceId,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/device-add/index.vue:209", "🚀 ~ getCharacteristics ~ res:", res);
          let writeCharacteristicId = "";
          res.characteristics.forEach((characteristic) => {
            if (characteristic.properties.write) {
              writeCharacteristicId = characteristic.uuid;
            }
          });
          common_vendor.index.__f__(
            "log",
            "at pages/device-add/index.vue:216",
            "🚀 ~ getCharacteristics ~ writeCharacteristicId:",
            writeCharacteristicId
          );
          setTimeout(() => {
            sendData(device, serviceId, writeCharacteristicId);
          }, 1e3);
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/device-add/index.vue:227", "获取特征值失败:", error);
        }
      });
    };
    const sendData = (device, serviceId, characteristicId) => {
      const msg = `SSID:${SSID.value};Password:${Password.value};ProductKey:${productKey.value};DeviceName:${deviceName.value};DeviceSecret:${deviceSecret.value};`;
      const buffer = new ArrayBuffer(msg.length);
      const uint8Array = new Uint8Array(buffer);
      for (let i = 0; i < msg.length; i++) {
        uint8Array[i] = msg.codePointAt(i);
      }
      common_vendor.index.writeBLECharacteristicValue({
        deviceId: device.deviceId,
        serviceId,
        characteristicId,
        value: buffer,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/device-add/index.vue:317", "發送的原始數據:", msg, res);
          common_vendor.index.showToast({
            title: "發送數據成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1e3);
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/device-add/index.vue:327", "發送數據失敗:", error);
        }
      });
    };
    common_vendor.onMounted(async () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      productKey.value = decodeURIComponent(currentPage.options.productKey || "");
      deviceSecret.value = decodeURIComponent(
        currentPage.options.deviceSecret || ""
      );
      deviceName.value = decodeURIComponent(currentPage.options.deviceName || "");
      common_vendor.index.__f__("log", "at pages/device-add/index.vue:343", "🚀 ~ onMounted ~ deviceSecret:", deviceSecret.value);
      await showWiFiInput();
    });
    common_vendor.onUnmounted(() => {
      if (isBluetoothInitialized.value) {
        common_vendor.index.stopBluetoothDevicesDiscovery();
        common_vendor.index.closeBluetoothAdapter();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(bluetoothDevices.value, (device, k0, i0) => {
          return {
            a: common_vendor.t(device.name),
            b: common_vendor.t(device.deviceId),
            c: common_vendor.t(device.RSSI),
            d: device.deviceId,
            e: common_vendor.o(($event) => connectDevice(device), device.deviceId)
          };
        }),
        b: SSID.value,
        c: common_vendor.o(($event) => SSID.value = $event.detail.value),
        d: Password.value,
        e: common_vendor.o(($event) => Password.value = $event.detail.value),
        f: common_vendor.o(handleClose),
        g: common_vendor.o(handleConfirm),
        h: common_vendor.p({
          mode: "input",
          title: "Wi-Fi信息",
          ["before-close"]: true
        }),
        i: common_vendor.sr(popup, "36d8fcac-0", {
          "k": "popup"
        }),
        j: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device-add/index.js.map
