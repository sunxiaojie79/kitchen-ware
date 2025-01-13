"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.ref({
      ip: "192.168.1.1",
      id: "Device001"
    });
    common_vendor.ref(true);
    const devices = common_vendor.ref([
      {
        name: "智能蒸鍋",
        ip: "192.168.1.100",
        imei: "123456789012345",
        isConnected: true
      },
      {
        name: "智能掃地機",
        ip: "192.168.1.101",
        imei: "987654321098765",
        isConnected: false
      }
    ]);
    const viewDevice = (device) => {
      common_vendor.index.navigateTo({
        url: `/pages/device-info/index?imei=${device.imei}`
      });
    };
    const addDevice = () => {
      common_vendor.index.navigateTo({
        url: "/pages/device-add/index"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(devices.value, (device, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(device.name),
            b: common_vendor.t(device.ip),
            c: common_vendor.t(device.imei),
            d: common_vendor.o(($event) => viewDevice(device), device.imei),
            e: device.isConnected
          }, device.isConnected ? {
            f: common_assets._imports_1
          } : {}, {
            g: device.imei
          });
        }),
        b: common_assets._imports_0,
        c: common_vendor.o(addDevice)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
