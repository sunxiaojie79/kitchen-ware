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
      common_vendor.index.__f__(
        "log",
        "at pages/device-info/index.vue:90",
        "🚀 ~ addDevice ~ currentPage1:",
        encodeURIComponent(decodeURIComponent(currentPage.options.deviceSecret))
      );
      common_vendor.index.navigateTo({
        url: `/pages/device-add/index?productKey=${encodeURIComponent(
          decodeURIComponent(currentPage.options.productKey)
        )}&deviceSecret=${encodeURIComponent(
          decodeURIComponent(currentPage.options.deviceSecret)
        )}&deviceName=${encodeURIComponent(
          decodeURIComponent(currentPage.options.deviceName)
        )}`
      });
    };
    const convertToHourMinute = (minutes) => {
      if (!minutes)
        return "0時0分";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}時${mins}分`;
    };
    const getDeviceInfo = async (deviceName) => {
      try {
        const res = await common_vendor.index.request({
          url: `https://yczmcj.com/prod-api/device/deviceProp`,
          method: "GET",
          data: {
            deviceName
          },
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/device-info/index.vue:126", 111, res.data);
        if (res.data.code === 200) {
          deviceData.value = [
            {
              label: "火種時間",
              value: convertToHourMinute(res.data.data.sparkFireWorkMinutes)
            },
            {
              label: "細火時間",
              value: convertToHourMinute(res.data.data.smallFireWorkMinutes)
            },
            {
              label: "大火時間",
              value: convertToHourMinute(res.data.data.bigFireWorkMinutes)
            },
            {
              label: "環保火時間",
              value: convertToHourMinute(res.data.data.epFireWorkMinutes)
            },
            { label: "進水量", value: `${res.data.data.inflowWater}立方` },
            { label: "排水次數", value: `${res.data.data.drainCount}次` },
            {
              label: "點火器",
              value: `${res.data.data.igniter === 0 ? "正常" : "不正常"}`
            },
            {
              label: "火種閥門",
              value: `${res.data.data.sparkValve === 0 ? "正常" : "不正常"}`
            },
            {
              label: "細火閥",
              value: `${res.data.data.smallFireValve === 0 ? "正常" : "不正常"}`
            },
            {
              label: "大火閥",
              value: `${res.data.data.bigFireValve === 0 ? "正常" : "不正常"}`
            },
            {
              label: "環保閥",
              value: `${res.data.data.epFireValve === 0 ? "正常" : "不正常"}`
            },
            {
              label: "排水閥",
              value: `${res.data.data.drainValve === 0 ? "正常" : "不正常"}`
            }
          ];
        } else {
          common_vendor.index.showToast({
            title: "獲取設備詳情失敗",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/device-info/index.vue:180", "獲取設備詳情錯誤:", error);
        common_vendor.index.showToast({
          title: "網絡請求失敗",
          icon: "none"
        });
      }
    };
    let intervalId = null;
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      common_vendor.index.__f__("log", "at pages/device-info/index.vue:193", "🚀 ~ onMounted ~ pages:", pages);
      const currentPage = pages[pages.length - 1];
      const deviceName = decodeURIComponent(currentPage.options.deviceName);
      if (deviceName) {
        getDeviceInfo(deviceName);
        intervalId = setInterval(() => {
          getDeviceInfo(deviceName);
        }, 5e3);
      }
    });
    common_vendor.onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });
    const splitValue = (value) => {
      return value.split(/(\d+)/).filter(Boolean);
    };
    const isNumber = (str) => {
      return /^\d+$/.test(str);
    };
    const isStatusValue = (value) => {
      return value === "正常" || value === "不正常";
    };
    const getStatusClass = (value) => {
      return value === "正常" ? "status-normal" : "status-abnormal";
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$1,
        b: common_assets._imports_1,
        c: common_assets._imports_2,
        d: common_vendor.o(addDevice),
        e: common_vendor.f(deviceData.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.label),
            b: isStatusValue(item.value)
          }, isStatusValue(item.value) ? {
            c: common_vendor.t(item.value),
            d: common_vendor.n(getStatusClass(item.value))
          } : {
            e: common_vendor.f(splitValue(item.value), (part, index2, i1) => {
              return {
                a: common_vendor.t(part),
                b: isNumber(part) ? 1 : "",
                c: index2
              };
            })
          }, {
            f: index
          });
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device-info/index.js.map
