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
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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