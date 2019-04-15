const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide:false,
    teamId:'',
    userId:'',
    teamName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('【传入新建团队id参数】【传入团队id参数成功】',options)
    this.data.teamId=options.teamId
    this.userId =getApp().globalData.openId
    teamCollection.doc(options.teamId)
      .get({
        success: res => {
          console.log('【获取指定用户team信息】【获取成功】', res.data),
            this.setData({
              leaderId: res.data.name
            })
        }
      })
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