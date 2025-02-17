"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const deviceData = common_vendor.ref([]);
    const addDevice = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      common_vendor.index.navigateTo({
        url: `/pages/device-add/index?productKey=${encodeURIComponent(
          currentPage.options.productKey
        )}&deviceSecret=${encodeURIComponent(
          currentPage.options.deviceSecret
        )}&deviceName=${encodeURIComponent(currentPage.options.deviceName)}`
      });
    };
    const getDeviceInfo = async (deviceName) => {
      try {
        const res = await common_vendor.index.request({
          url: `http://47.83.19.236:80/prod-api/device/deviceProp`,
          method: "GET",
          data: {
            deviceName
          },
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/device-info/index.vue:103", 111, res.data);
        if (res.data.code === 200) {
          deviceData.value = [
            { label: "火種時間", value: `${res.data.data.sparkFireWorkMinutes}分` },
            { label: "細火時間", value: `${res.data.data.smallFireWorkMinutes}分` },
            { label: "大火時間", value: `${res.data.data.bigFireWorkMinutes}分` },
            { label: "環保火時間", value: `${res.data.data.epFireWorkMinutes}分` },
            { label: "進水量", value: `${res.data.data.inflowWater}立方` },
            { label: "排水次數", value: `${res.data.data.drainCount}次` }
          ];
        } else {
          common_vendor.index.showToast({
            title: "獲取設備詳情失敗",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/device-info/index.vue:121", "獲取設備詳情錯誤:", error);
        common_vendor.index.showToast({
          title: "網絡請求失敗",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      common_vendor.index.__f__("log", "at pages/device-info/index.vue:132", "🚀 ~ onMounted ~ pages:", pages);
      const currentPage = pages[pages.length - 1];
      const deviceName = decodeURIComponent(currentPage.options.deviceName);
      if (deviceName) {
        getDeviceInfo(deviceName);
      }
    });
    const splitValue = (value) => {
      return value.split(/(\d+)/).filter(Boolean);
    };
    const isNumber = (str) => {
      return /^\d+$/.test(str);
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$1,
        b: common_assets._imports_1,
        c: common_assets._imports_2,
        d: common_vendor.o(addDevice),
        e: common_vendor.f(deviceData.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.f(splitValue(item.value), (part, index2, i1) => {
              return {
                a: common_vendor.t(part),
                b: isNumber(part) ? 1 : "",
                c: index2
              };
            }),
            c: index
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device-info/index.js.map
