const app = getApp();

//获取内容
function getContent(cb) {
  wx.showLoading({
    title: '数据加载中...',
  });

  var flag = false;
  wx.request({
    url: app.CDN_URL + 'content.json?t=1',
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (typeof cb === "function") {
        cb(res);
      }
    },
    fail: function (res) {
    },
    complete: function (res) {
      wx.hideLoading();
    }
  });
}

//获取题库数据
function getConfig(cb) {
  wx.showLoading({
    title: '数据加载中...',
    mask:true
  });

  var flag = false;
  wx.request({
    url: app.CDN_URL + 'config.json',
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.data instanceof Array && typeof cb === "function") {
        cb(res);
      }
    },
    fail: function (res) {
    },
    complete: function (res) {
      wx.hideLoading();
    }
  });
}

//获取推荐
function getFanWords(letters) {
  var length=letters.length;
  if (app.globalData.selectedIndex == null){
    try {
      var Rand = Math.random();
      var index = (0 + Math.round(Rand * (length- 1)));
      app.globalData.selectedIndex = index;
      return letters[index];
    } catch (e) {
      app.globalData.selectedIndex = 0;
      return letters[0];
    }
  }else{
    var index = (app.globalData.selectedIndex + 1) % length;
    app.globalData.selectedIndex=index;
    return letters[index];
    
  }
 
}

//获取推荐
function getFanWordsIndex(letters) {
  var length = letters.length;
  if (app.globalData.selectedIndex == null) {
    try {
      var Rand = Math.random();
      var index = (0 + Math.round(Rand * (length - 1)));
      app.globalData.selectedIndex = index;
      return index;
    } catch (e) {
      app.globalData.selectedIndex = 0;
      return 0;
    }
  } else {
    var index = (app.globalData.selectedIndex + 1) % length;
    app.globalData.selectedIndex = index;
    return index;

  }

}

//获取分享
function getShareWords(){
  var letters = getLetters();
  try {
    var Rand = Math.random();
    var index = (0 + Math.round(Rand * 5));
    return letters[index];
  } catch (e) {
    return letters[0];
  }
}

//提交点击数
function submitClick(appid) {
  if (!appid) {
    return;
  }

  var now = util.formatNow();
  console.log(now);

  var flag = false;
  wx.request({
    url: app.HTTP_SERVER + 'app/zuji/submitclick.htm',
    data: {
      appid: now + "-" + appid
    },
    method: "POST",
    header: {
      'sessionkey': 'zujisk',
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
    },
    fail: function (res) {
    }
  });
}

//统计广告后台点击次数
function updateStatisCount(appname, appid, cb) {
  wx.request({
    url: app.HTTP_SERVER + 'app/commonrest/submitStatis.htm',
    method: "POST",
    data: {
      appname: appname,
      appid: appid,
      sharetype: 2001,
      fromappid: app.APP_ID
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (typeof cb === "function") {
        cb(res);
      }
    },
    fail: function (res) { },
    complete: function (res) {
      wx.hideLoading();
    }
  })
}

module.exports = {
  getConfig: getConfig,
  getFanWords: getFanWords,
  getShareWords: getShareWords,
  getContent: getContent,
  submitClick: submitClick,
  updateStatisCount: updateStatisCount,
  getFanWordsIndex: getFanWordsIndex
}