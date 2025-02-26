"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const device = common_vendor.ref({});
    const showDeviceNameInput = () => {
      const savedDeviceName = common_vendor.index.getStorageSync("userDeviceName") || "";
      common_vendor.index.showModal({
        title: "請輸入設備名稱",
        editable: true,
        placeholderText: "請輸入設備名稱",
        content: savedDeviceName,
        // 将保存的设备名称填入输入框
        success: function(res) {
          if (res.confirm) {
            const deviceName = res.content.trim();
            if (deviceName) {
              common_vendor.index.setStorageSync("userDeviceName", deviceName);
              getDevice(deviceName);
            } else {
              common_vendor.index.showToast({
                title: "請輸入正確的設備名稱",
                icon: "none"
              });
              setTimeout(() => {
                showPhoneNumberInput();
              }, 1500);
            }
          } else {
            common_vendor.index.showToast({
              title: "必須輸入設備名稱",
              icon: "none"
            });
            setTimeout(() => {
              showPhoneNumberInput();
            }, 1500);
          }
        }
      });
    };
    common_vendor.onMounted(() => {
      showDeviceNameInput();
    });
    const getDevice = async (deviceName) => {
      if (!deviceName) {
        common_vendor.index.showToast({
          title: "設備名稱不能為空",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.index.request({
          url: `https://yczmcj.com/prod-api/device/getDeviceByDeviceName/${deviceName}`,
          method: "GET",
          header: {
            "Content-Type": "application/json"
          }
        });
        if (res.data.code === 200) {
          if (res.data.data) {
            device.value = res.data.data;
          } else {
            common_vendor.index.showToast({
              title: "未獲取到設備",
              icon: "none"
            });
          }
          common_vendor.index.__f__("log", "at pages/index/index.vue:108", 222, device.value);
        } else {
          common_vendor.index.showToast({
            title: "獲取設備失敗",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:116", "獲取設備錯誤:", error);
        common_vendor.index.showToast({
          title: "網絡請求失敗",
          icon: "none"
        });
      }
    };
    const viewDevice = (device2) => {
      common_vendor.index.navigateTo({
        url: `/pages/device-info/index?deviceName=${encodeURIComponent(
          device2.deviceName
        )}&productKey=${encodeURIComponent(
          device2.productKey
        )}&deviceSecret=${encodeURIComponent(device2.deviceSecret)}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: device.value.deviceName
      }, device.value.deviceName ? {
        b: common_assets._imports_0,
        c: common_vendor.t(device.value.deviceName),
        d: common_assets._imports_1,
        e: common_vendor.o(($event) => viewDevice(device.value))
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
