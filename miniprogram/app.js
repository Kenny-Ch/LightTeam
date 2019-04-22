//app.js
App({
  globalData: {
    userInfo: {},
    openid:'',
    hasUserInfo: false,
  },
  onLaunch: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //console.log("【app.js】【用户授权】【成功授权】")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //console.log('【app.js】【获取用户信息】【获取信息成功】',res.userInfo)调试：输出获取到的用户信息判断是否成功获取
              // this.setData({
              //   userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
              // })
              // this.globalData.userInfo=res.userInfo
              // wx.cloud.callFunction({
              //   name: 'getOpenid', 
              //   complete: res => {
              //     this.globalData.openid = res.result.openid;
              //   }
              // }),
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  getApp().globalData.openid = res.result.openid
                  console.log("【app.js】【已授权】【已获取用户信息】【信息成功存入globalData中】", res.result)
                  // wx.navigateTo({
                  //   url: '../userConsole/userConsole',
                  // })
                },
                fail: err => {
                  console.error('【app.js】【已授权】【获取信息失败】', err)
                  // wx.navigateTo({
                  //   url: '../deployFunctions/deployFunctions',
                  // })
                }
              })
             //console.log("【app.js】【用户信息存入】【信息成功存入globalData中】",getApp().globalData)//若完成上一步走到这一步的话输出“成功”
            }
          })
        }
      }
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    }
    else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  }
    

    
    
  
})
