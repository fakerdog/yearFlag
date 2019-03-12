// pages/selFlag/selFlag.js

const app = getApp();
var util = require("../../utils/util.js");
var server = require("../../utils/server.js");


Page({

  destWidth: 892,
  destHeight: 1504,
  /**
   * 页面的初始数据
   */
  data: {
    textnumber_limit: 6,
    totalSelectedCount: 0,
    headflag: true,
    zdychecknum: 0,
    zdyflag: [],
    nochecked: "../../images/nochecked.png",
    ischecked: "../../images/checked.png",
    isonload: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      myname: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      savemodalObject: app.globalData.savemodalObject
    })
    //分享
    wx.showShareMenu({
      withShareTicket: false
    });
    //获取用户系统
    wx.getSystemInfo({
      success: res => {
        var iphone = true;
        var system = res.system;
        if (system.indexOf("iOS") > -1) {
          iphone = true;
        } else {
          iphone = false;
        }
        this.setData({
          iphone: iphone
        });
      }
    });
    this.prepareContent();
    this.setData({
      showModalStatus: false,
      hiddenCanvas: true
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  prepareContent: function () {
    //加载数据
    server.getContent(res => {
      this.data.contentList = res.data;
      for (var i = 0; i < this.data.contentList.length; i++) {
        for (var j = 0; j < this.data.contentList[i].length; j++) {
          this.data.contentList[i][j] = {
            text: this.data.contentList[i][j],
            checked: false
          }
        }
      }
      this.changeList();
    })
  },
  changeList: function () {
    this.data.curIndex = server.getFanWordsIndex(this.data.contentList);
    this.setData({
      curIndex: this.data.curIndex,
      curList: this.data.contentList[this.data.curIndex]
    })
  },
  setmyFlag: function (e) {
    if (e.detail.value.length > 14) {
      wx.showToast({
        title: '字数限制14个',
      });
      this.setData({
        zdyflagtext: this.data.zdyflagtext
      })
      return
    }

    this.data.zdyflagtext = e.detail.value;
  },

  writedone: function () {
    if (util.isEmpty(this.data.zdyflagtext)) {
      wx.showToast({
        title: 'flag不能为空',
      })
      return;
    }

    if (this.data.isonload) {
      this.setData({
        isonload: false,
        isfirstflag: true
      })

    }

    var totalSelectedCount = this.data.totalSelectedCount;
    var zdyflag = this.data.zdyflag;
    var zdychecknum = zdyflag.length;
    if (totalSelectedCount >= this.data.textnumber_limit) {
      wx.showToast({
        title: '最多只能选' + this.data.textnumber_limit + '个',
      })
      return;
    }
    zdyflag.push({
      type: "0",
      text: this.data.zdyflagtext,
    })
    totalSelectedCount += 1;
    this.setData({
      zdyflag: zdyflag,
      zdychecknum: zdyflag.length,
      zdyflagtext: "",
      totalSelectedCount: totalSelectedCount
    })
  },

  shiftcheckbox: function (e) {
    if (this.data.isonload) {
      this.setData({
        isonload: false,
        isfirstflag: true
      })

    }

    var tapindex = e.currentTarget.dataset.index;
    var totalSelectedCount = this.data.totalSelectedCount;
    if (totalSelectedCount >= this.data.textnumber_limit) {
      wx.showToast({
        title: '最多只能选' + this.data.textnumber_limit + '个',
      })
      return;
    }
    var zdyflag = this.data.zdyflag;
    var bchecked = !this.data.curList[tapindex].checked;
    this.data.curList[tapindex].checked = bchecked;
    this.data.contentList[this.data.curIndex][tapindex].checked = bchecked;
    var text = this.data.curList[tapindex].text;
    if (this.data.curList[tapindex].checked) {
      zdyflag.push({
        type: "1",
        i: this.data.curIndex,
        j: tapindex,
        text: text
      })
    } else {
      console.log(this.data.curList[tapindex])
      this.data.curList[tapindex].checked = false;
      this.data.contentList[this.data.curIndex][tapindex].checked = false;
      for (var i = 0; i < zdyflag.length; i++) {
        if (zdyflag[i].type == "1" && zdyflag[i].i == this.data.curIndex && zdyflag[i].j == tapindex && zdyflag[i].text == text) {
          zdyflag.splice(i, 1);
          break;
        }
      }
    }
    this.setData({
      zdyflag: zdyflag,
      curList: this.data.curList,
      totalSelectedCount: zdyflag.length
    });
  },

  //删除自定义flag
  deletezdy: function (e) {
    var zdyindex = e.currentTarget.dataset.zdyindex;
    var zdyflag = this.data.zdyflag;
    var obj = zdyflag.splice(zdyindex, 1)[0];
    if (obj.type == "1") {
      if (obj.i == this.data.curIndex) {
        this.data.curList[obj.j].checked = false;
      }
      this.data.contentList[obj.i][obj.j].checked = false;
    }
    this.setData({
      zdyflag: zdyflag,
      curList: this.data.curList,
      totalSelectedCount: zdyflag.length
    })
  },
  //收起
  hideselModule: function () {
    this.setData({
      showFlagModule: false
    })
  },

  //展开
  showselModule: function () {
    this.setData({
      isfirstflag: false,
      showFlagModule: true,
      isonload:false
    })
  },
  //换一批
  changeGroup: function () {
    this.changeList();
  },

  againFill: function () {
    this.setData({
      showModalStatus: false
    })
  },
  hideSaveModal: function () {
    this.setData({
      showSaveModal: false
    })
  },
  toSaveadv: function (e) {
    if (e.type == "success") {
      this.setData({
        showSaveModal: false,
      });
      //点击数统计
      server.updateStatisCount(this.data.savemodalObject.appname, this.data.savemodalObject.appid);
    }
  },
  //点击开始画图
  formSubmit: function (e) {
    if (this.data.zdyflag.length < 1) {
      wx.showModal({
        title: '提示',
        content: '至少有一个flag',
        showCancel: false
      })
      return;
    }
    if (util.isEmpty(this.data.myname)) {
      this.data.myname = app.globalData.userInfo.nickName;
    }
    if (this.data.headflag) {
      this.data.avatarUrl = app.globalData.userInfo.avatarUrl; //头像
    }
    var canvasflag = [];
    var flagList = this.data.flagList;
    // for(var i=0;i<flagList.length;i++){
    //   if(flagList[i].checked==true){
    //     canvasflag.push(flagList[i].text)
    //   }
    // }
    var zdyflag = this.data.zdyflag;
    console.log(zdyflag);
    for (var j = 0; j < zdyflag.length; j++) {
      canvasflag.push(zdyflag[j].text)
    }
    this.data.canvasflag = canvasflag;
    //获取当前时间
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    var nowDate = "立于" + year + "/" + month + "/" + day + "/ " + hour + ":" + minute;
    this.data.nowDate = nowDate;
    var that = this;
    that.again();
  },

  again: function () {
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    });
    var that = this;
    if (that.data.headflag) {
      wx.getImageInfo({
        src: app.CDN_URL + "Qrcode.png",
        success: function (res1) {
          that.data.acode = res1.path;
          wx.getImageInfo({
            src: that.data.avatarUrl,
            success: function (res) {
              that.data.avatarUrl = res.path;
              that.prepareDrawCtx();
              //显示图片
              setTimeout(function () {
                that.drawImageShow(res => {
                  that.setData({
                    showModalStatus: true,
                    hiddenCanvas: true,
                    headflag: false,
                    imagePath: res.tempFilePath,
                  });
                })
              }, 500)

            }
          })
        }
      })
    } else {
      that.prepareDrawCtx();
      setTimeout(function () {
        that.drawImageShow(res => {
          that.setData({
            showModalStatus: true,
            hiddenCanvas: true,
            imagePath: res.tempFilePath
          });
        });
      }, 500)
    }
  },

  //canvas画图
  prepareDrawCtx: function () {
    this.setData({
      hiddenCanvas: false
    });
    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage(app.globalData.userInfo.gender == 1 ? "../../images/mcanvasbg.png" : "../../images/wcanvasbg.png", 0, 0, this.destWidth, this.destHeight);

    var myname = this.data.myname;
    if (!myname) {
      myname = "我";
    }

    //头像绘制start
    var avatarWidth = 120;
    var avatarHeight = 120;
    var avatarX = 386;
    var avatarY = 375;
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.setFillStyle("#ffffff");
    ctx.arc(avatarWidth / 2 + avatarX, avatarHeight / 2 + avatarY, avatarWidth / 2, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(this.data.avatarUrl, avatarX, avatarY, avatarWidth, avatarHeight);
    ctx.restore();

    ctx.beginPath()
    ctx.arc(avatarWidth / 2 + avatarX, avatarHeight / 2 + 2 + avatarY, avatarWidth / 2 + 2, 0, 2 * Math.PI);
    ctx.setLineWidth("6");
    ctx.setStrokeStyle(app.globalData.userInfo.gender == 1 ? '#30A8DD' :"#FEBEB4")
    ctx.stroke()

    var username = myname;
    ctx.textAlign = 'left';
    ctx.setFillStyle("#000");
    ctx.setFontSize(40);
    ctx.fillText(username, 150, 1300);
    var nowDate = this.data.nowDate;
    ctx.setFontSize(30);
    ctx.fillText(nowDate, 150, 1360);
    var canvasflag = this.data.canvasflag;
    var xx = 610;
    for (var i = 0; i < canvasflag.length; i++) {
      ctx.drawImage(app.globalData.userInfo.gender == 1 ? "../../images/mxuhao.png" : "../../images/wxuhao.png", 165, xx - 25, 80, 28);
      ctx.textAlign = 'left';
      ctx.setFontSize(40);
      ctx.fillText((i + 1) + "     " + canvasflag[i], 175, xx);
      xx += 100;
    }

    ctx.drawImage("../../images/qizi.png", 486, 1315, 50, 70);
    ctx.drawImage(this.data.acode, 600, 1250, 146, 170);


    //主要图片绘制end
    var tfontsize = 50; //字体大小
    ctx.setFontSize(tfontsize);
    //底部end
    this.context = ctx;
  },


  //画图
  drawImageShow: function (cb) {
    //图片显示
    var that = this;
    var ctx = that.context;
    ctx.draw(false, drawRes => {
      if (that.data.iphone) {
        wx.canvasToTempFilePath({
          destWidth: that.destWidth,
          destHeight: that.destHeight,
          width: that.destWidth,
          height: that.destHeight,
          canvasId: 'shareCanvas',
          success: function (res) {
            if (cb) {
              cb(res);
            }
          },
          complete: function (res) {
            wx.hideLoading();
          }
        });
      } else {
        setTimeout(function () {
          wx.canvasToTempFilePath({
            destWidth: that.destWidth,
            destHeight: that.destHeight,
            width: that.destWidth,
            height: that.destHeight,
            canvasId: 'shareCanvas',
            success: function (res) {
              if (cb) {
                cb(res);
              }
            },
            complete: function (res) {
              wx.hideLoading();
            }
          });
        }.bind(this), 300);
      }
    });
  },

  /**
 * 保存图片
 */
  saveImg: function () {
    wx.showLoading({
      title: '图片保存中...',
    });
    //重新画图
    this.prepareDrawCtx();
    var ctx = this.context;
    //画图
    this.drawImageShow(res => {
      this.setData({
        hiddenCanvas: true
      });
      this.data.imagePath = res.tempFilePath;
      this._saveImageAlbum();
    });
  },

  /**
 * 保存图片
 */
  _saveImageAlbum: function () {
    var filePath = this.data.imagePath;
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: res => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 2000
        });
        this.setData({
          hiddenCanvas: false
        });
        // console.log(this.data.savemodalObject)
        if (this.data.savemodalObject) {
          this.setData({
            showSaveModal: true
          });
        }
      },
      complete: function (res) {
        //图片保存完成
        setTimeout(
          function () {
            wx.hideLoading();
          }, 1000)
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快来立你的2019新年flag吧',
      path: '/pages/index/index',
      imageUrl: ""
    }
  }
})