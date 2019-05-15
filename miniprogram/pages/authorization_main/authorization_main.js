const db = wx.cloud.database();
Page({
  data: {
    currentTab: '',
    openId:'',
    userInfo:''
  },

  onLoad: function(options) {
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       console.log("【authorization_main】【用户授权】【成功授权】")
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
    //           })
    //           console.log("【authorization_main】【用户信息存入】【信息成功存入该页面的data中】", res.userInfo)//若完成上一步走到这一步的话输出“成功”
    //         }
    //       })
    //       wx.switchTab({
    //         url: '/pages/index/index',
    //       })
    //     }
    //   }
    // })
  },
  onGetUserInfo:function(){
    wx.getSetting({
      success: res => {
        var that=this;
        if (res.authSetting['scope.userInfo']) {
          console.log("【authorization_main】【用户授权】【成功授权】")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
              })
              console.log("【authorization_main】【用户信息存入】【信息成功存入该页面的data中】", res.userInfo)//若完成上一步走到这一步的话输出“成功”
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  console.log('【index】【云函数获取openid】【成功获取】', res.result.openid)
                  that.setData({
                    openId: res.result.openid
                  })
                  db.collection('user').where({
                    _openid: 'that.data.openId'
                  }).get({
                    success(res) {
                      console.log(res.data)
                      if(!res.data.length){
                        db.collection('user').add({
                          data: {
                            avatarUrl: that.data.userInfo.avatarUrl,
                            nickName: that.data.userInfo.nickName,
                            taskList:[],
                            teamList:[]
                          },
                          success(res) {
                            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                            console.log(res)
                          },
                          fail: console.error
                        })
                      }
                    }
                  })
                },
                fail: err => {
                  console.error('【index】【云函数获取openid】【失败】', err)
                }
              })
              
            }
          })
          wx.redirectTo({
            url: '/pages/guidance/guidance'
          })
        }
        else{
          wx.showModal({
            title: '提示',
            content: '您还未登录，登录后可获得完整体验哦',
            showCancel: false,
            confirmText: '返回授权',
            success: function (res) {
              if (res.confirm) {
                console.log('【beinvited】【用户点击了“返回授权”】')
              }
            }
          })
        }
      }
    })
  },
  /*** 滑动切换tab***/
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },
  /*** 点击tab切换***/
  swichNav: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    })
    // console.log(e.detail.setdata.current)
  }
})