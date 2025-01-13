"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const deviceData = common_vendor.ref([
      { label: "火種時間", value: "2時30分" },
      { label: "細火時間", value: "1時45分" },
      { label: "大火時間", value: "3時10分" },
      { label: "環保火時間", value: "0時50分" },
      { label: "進水量", value: "5立方" },
      { label: "排水次數", value: "10次" }
    ]);
    const splitValue = (value) => {
      return value.split(/(\d+)/).filter(Boolean);
    };
    const isNumber = (str) => {
      return /^\d+$/.test(str);
    };
    const connectWifi = () => {
    };
    const deviceSettings = () => {
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$1,
        b: common_assets._imports_1,
        c: common_assets._imports_2,
        d: common_vendor.f(deviceData.value, (item, index, i0) => {
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
        }),
        e: common_assets._imports_1,
        f: common_vendor.o(connectWifi),
        g: common_assets._imports_3,
        h: common_vendor.o(deviceSettings)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device-info/index.js.map
