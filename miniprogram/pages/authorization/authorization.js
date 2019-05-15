// pages/authorization/authorization.js
const db = wx.cloud.database()
const userCollection = db.collection('user')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    openId:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {




    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("【用户授权】【成功授权】")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)//调试：输出获取到的用户信息判断是否成功获取
              this.setData({
                userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
              })
              console.log(this.data.userInfo)//输出page的data里面userInfo这个列表，判断是否成功存进去了
              console.log("【用户信息存入】【信息成功存入该页面的data中】")//若完成上一步走到这一步的话输出“成功”
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
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
              if (!res.data.length) {
                db.collection('user').add({
                  data: {
                    avatarUrl: that.data.userInfo.avatarUrl,
                    nickName: that.data.userInfo.nickName,
                    taskList: [],
                    teamList: []
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
  },
 
  addData: function (event) {
    console.log(event)
    userCollection.add({
      data: {
        "nickName": this.data.userInfo.nickName,//读取这个页面的data里面userInfo这个列表的nickName项
        // "gender": this.data.userInfo.gender,//同理
        "avatarUrl" :this. data.userInfo.avatarUrl
        // "city": "CITY",
        // "province": "PROVINCE",
        // "country": "COUNTRY",
        // "avatarUrl": "AVATARURL",
        // "unionId": "UNIONID"
        // "avatarUrl": res.userInfo.avatarUrl,
        // "userInfo": res.userInfo
        // "watermark":
        // {
        //   "appid": "APPID",
        //   "timestamp": TIMESTAMP
        // }

      }
    })
  },
})