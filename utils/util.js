const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatNow() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return [year, month, day].map(formatNumber).join('');
}

function formatDate(fmt) { 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function getRand(citycount) {
  var total = 650;
  if (citycount < 5) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 10;
  } else if (citycount >= 5 && citycount < 10) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 30;
  }
  else if (citycount >= 10 && citycount < 20) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 50;
  }
  else if (citycount >= 20 && citycount <= 25) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 60;
  }
  else if (citycount > 25 && citycount <= 30) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 70;
  }
  else if (citycount > 30 && citycount < 35) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 80;
  }
  else if (citycount >= 35 && citycount < 40) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 85;
  }
  else if (citycount >= 40 && citycount < 65) {
    return new Number((citycount * 100 / 650).toFixed(1)) + 90;
  }
  else if (citycount >= 65) {
    return 99.9;
  }
}

//是否包含
function arrayContains(arr, item) {
  for (var i in arr) {
    if (arr[i] === item) return true;
  }
  return false;
}

//获取随机数
function rand(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

//获取日期
function getDateStr(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(formatNumber).join('');
}

function isEmpty(text) {
  if (text == undefined || text == null || text == '' || text == 'null' || text == 'undefined') {
    return true;
  } else {
    text = text.replace(/(\s*$)/g, '');
    if (text == '') {
      return true;
    }
  }
  return false;
}

module.exports = {
  formatTime: formatTime,
  formatNow: formatNow,
  formatDate: formatDate,
  arrayContains: arrayContains,
  getRand: getRand,
  rand: rand,
  getDateStr: getDateStr,
  isEmpty: isEmpty
}

