// pages/create_team/create_team.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamName: "",
    teamBrief:""
  },

  teamNameInput: function (e) {
    this.setData({
      teamName: e.detail.value
    })
  },
  briefInput: function (e) {
    this.setData({
      teamBrief: e.detail.value
    })
  },

  loginBtnClick: function (e) {
    console.log("团队：" + this.data.teamName + " 简介：" + this.data.teamBrief)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    teamCollection.add({
      data: {
        "teamname": this.data.teamName,
        "teambrief" : this.data.teamBrief
      },
      success: res => {
        console.log(res)
      }
    })
  }
})