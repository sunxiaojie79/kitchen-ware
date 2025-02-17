"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const device = common_vendor.ref({});
    const showPhoneNumberInput = () => {
      const savedPhoneNumber = common_vendor.index.getStorageSync("userPhoneNumber") || "";
      common_vendor.index.showModal({
        title: "請輸入手機號碼",
        editable: true,
        placeholderText: "請輸入手機號碼",
        content: savedPhoneNumber,
        // 将保存的手机号填入输入框
        success: function(res) {
          if (res.confirm) {
            const phoneNumber = res.content;
            if (/^1[3-9]\d{9}$/.test(phoneNumber)) {
              common_vendor.index.setStorageSync("userPhoneNumber", phoneNumber);
              getDevice(phoneNumber);
            } else {
              common_vendor.index.showToast({
                title: "請輸入正確的手機號碼",
                icon: "none"
              });
              setTimeout(() => {
                showPhoneNumberInput();
              }, 1500);
            }
          } else {
            common_vendor.index.showToast({
              title: "必須輸入手機號碼",
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
      showPhoneNumberInput();
    });
    const getDevice = async (phoneNumber) => {
      if (!phoneNumber) {
        common_vendor.index.showToast({
          title: "手機號碼不能為空",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.index.request({
          url: `http://47.83.19.236:80/prod-api/device/getDeviceByPhoneNumber/${phoneNumber}`,
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
