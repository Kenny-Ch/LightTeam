// pages/create_team/create_team.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamName: "",
    teamBrief:"",
    teamid:"5555"
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
    if(!this.data.teamName){
      console.log('【团队名称输入情况】【未输入】',event)
      wx.showToast({
        title: '团队的名称未填写哟~',
        icon: 'none',
        duration: 2000
      })
        // success(res) {
        //   if (res.confirm) {
        //     console.log('【弹窗点击情况】【用户点击确定】')
        //   } else if (res.cancel) {
        //     console.log('【弹窗点击情况】【用户点击取消】')
        //   }
        // }
    }
    else{
      teamCollection.add({
        data: {
          "teamname": this.data.teamName,
          "teambrief": this.data.teamBrief,
          "leader":getApp().globalData.openid,
          "taskList":[],
          "unfinishedTask":0,
          "userList":[],
          "userNum":0
        },
        success: res => {
          this.setData({
            teamid:res._id
          })
          console.log('【添加团队信息】【成功添加团队信息】', this.data)
          wx.redirectTo({
            url: '/pages/invite/invite?teamid=' + res._id
          })
        }
      })
      
    }
  
  }
})