//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");
var server = require("../../utils/server.js");

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modalbackimg: "../../images/redenvelope.png"
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    //准备数据
    try {
      this.prepareAdvert();
    } catch (e) { }

  },
  toRedBag: function (e) {
    if (e.type == "success") {
      this.setData({
        redPackageModal: false,
      });
      //点击数统计
      server.updateStatisCount(this.data.modalObj.appname, this.data.modalObj.appid);
    }
  },

  toclose: function () {
    this.setData({
      redPackageModal: false,
    });
  },

  tomore: function (e) {
    if (e.type == "success") {
      //点击数统计
      server.updateStatisCount(this.data.moreObj.appname, this.data.moreObj.appid);
    }
  },

  tobanner: function (e) {
    if (e.type == "success") {
      //点击数统计
      server.updateStatisCount(this.data.bannerObj.appname, this.data.bannerObj.appid);
    }
  },
  torand: function (e) {
    if (e.type == "success") {
      //点击数统计
      server.updateStatisCount(this.data.randObj.appname, this.data.randObj.appid);
    }
  },
  //广告位数据
  prepareAdvert: function () {
    //加载数据
    server.getConfig(res => {
      if (res.data) {
        var leftArr = [];
        var moreObj = null;
        var bannerObj = null;
        var shareObj = null;
        var contactObj = null;
        var promotionObj = null;
        var modalObj = null;
        var sharewarnObject = null;
        var savemodalObject = null;

        if (res.data) {
          for (var i = 0; i < res.data.length; i++) {
            var obj = res.data[i];
            if (obj.id === 0 || obj.id === 1 || obj.id === 2 || obj.id === 3) {
              leftArr.push(obj);
            } else if (obj.id === 4) {
              moreObj = obj;
            } else if (obj.id === 5) {
              bannerObj = obj;
            } else if (obj.id === 6) {
              shareObj = obj;
            } else if (obj.id === 100) {
              contactObj = obj;
            } else if (obj.id === 102) {
              promotionObj = obj;
            } else if (obj.id === 103) {
              modalObj = obj;
            } else if (obj.id === 300) {
              savemodalObject = obj;
            }
          }
        }

        // app.globalData.leftArr = leftArr;
        // app.globalData.moreObj = moreObj;
        // app.globalData.bannerObj = bannerObj;
        // app.globalData.shareObj = shareObj;
        // app.globalData.modalObj = modalObj;
        // app.globalData.controlObject = controlObject;
        app.globalData.savemodalObject = savemodalObject;

        if (modalObj) {
          this.setData({
            redPackageModal: true
          });
          //开启定时器
          if (modalObj.limit != -1) {
            var modalfootersecond = modalObj.limit;
            this.setData({
              modalfootersecond: modalfootersecond
            });
            var itime = setInterval(() => {
              if (modalfootersecond == 0) {
                this.setData({
                  redPackageModal: false
                });
                clearInterval(itime);
              } else {
                modalfootersecond--;
                this.setData({
                  modalfootersecond: modalfootersecond
                });
              }
            }, 1000);
          }
        }

        var randObj = null;
        if (leftArr && leftArr.length > 0) {
          var rand = util.rand(0, leftArr.length - 1);
          randObj = leftArr[rand];
        }

        var showPromotion = false;
        if (promotionObj) {
          var tmpflag = app.getTodayStorage("showpromotion");
          if (!tmpflag) {
            showPromotion = true;
          }
        }
        this.setData({
          moreObj: moreObj,
          bannerObj: bannerObj,
          shareObj: shareObj,
          randObj: randObj,
          contactObj: contactObj,
          promotionObj: promotionObj,
          showPromotion: showPromotion,
          modalObj: modalObj
        });
      }
    });
  },
  //跳转选择Flag页面
  getUserInfo: function (e) {
    if (typeof (e.detail.userInfo) == "undefined") { //授权失败
      wx.showToast({
        title: '请授权',
      })
      return;
    }
    app.globalData.userInfo = e.detail.userInfo;
    wx.navigateTo({
      url: '../selFlag/selFlag',
    })


  },
})