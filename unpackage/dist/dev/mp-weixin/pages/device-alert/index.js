"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const messages = common_vendor.ref([
      {
        content: "您的设备状态提醒",
        time: "2024-01-20 10:30"
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(messages.value, (message, index, i0) => {
          return {
            a: common_vendor.t(message.content),
            b: common_vendor.t(message.time),
            c: index
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device-alert/index.js.map
