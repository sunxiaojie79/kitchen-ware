"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.ref({ connected: true });
    common_vendor.ref({ connected: true });
    common_vendor.ref({ connected: true });
    common_vendor.ref({
      hotpot: "21时15分",
      foot: "0时0分"
    });
    common_vendor.ref({
      input: 999,
      output: 101
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/device-utilities/index.js.map
