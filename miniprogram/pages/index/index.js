//index.js
const app = getApp()
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openId:''
  },
  
  onLoad: function(options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 已经授权
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
              })
              console.log("【index.js】【用户信息存入】【userInfo信息成功存入data中】", res.userInfo )//若完成上一步走到这一步的话输出“成功”
            }
          })
        }
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('【index.js】【云函数获取openid】【成功获取】', res.result.openid)
        this.setData({
          openId: res.result.openid
        })
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('【云函数获取openid】【失败】', err)
      }
    })
    teamCollection.get().then(res => {
     this.setData({
       team : res.data
     })
   })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  addTeam:function(){
    console.log(this.data.userInfo, this.data.openId)
    wx.navigateTo({
      url: '/pages/create_team/create_team?nickName='+this.data.userInfo.nickName+'&url='+this.data.userInfo.avatarUrl+'&openId='+this.data.openId
    })
  },
  teamDetail:function(){
    wx.navigateTo({
      url: '/pages/task-list/task-list'
    })
  }
})
