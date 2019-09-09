//logs.js
const util = require('../../utils/util.js')
Page({
  data: {
    userName:'',
    passWrod:''
  },
  onLoad: function () {
    wx.request({
      url: 'https://you.163.com/xhr/common/checklogin.json?csrf_token=5c61727f0a4c5d51337c8e075b272473&__timestamp=1566137781618',
      method:'get',
      success(res) {
        console.log(res.data)
      }
    })
  }
})
