// pages/authorization/authorization.js
const db = wx.cloud.database()
const nameCollection = db.collection('name')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

 addData:function(event){
console.log(event)
nameCollection.add({
  data:{
    // "openId": "OPENID",
    //  "nickName": "NICKNAME"
    // userinfo-nickname
    // "name":'getOpenid',
    // "nickname": res.userInfo.nickName
    // // "gender": GENDER,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var nickName = that.data.nickName;
    var avatarUrl = that.data.avatarUrl;
    var db = "no";
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              const userInfo = res.userInfo
              const nickName = userInfo.nickName
              const avatarUrl = userInfo.avatarUrl
              const gender = userInfo.gender // 性别 0：未知、1：男、2：女
              const province = userInfo.province
              const city = userInfo.city
              const country = userInfo.country
             
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

  }
})