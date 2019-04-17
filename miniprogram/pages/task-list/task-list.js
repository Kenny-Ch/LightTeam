// pages/detail-task/detal-task.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
const taskCollection = db.collection('task')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   uhide:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    teamCollection.doc(options.id).get({
      success: res => {
        this.setData({
          team: res.data
        })
        console.log(team)
      }
    })
    
    // taskCollection.get().then(res => {
    //   this.setData({
    //     task: res.data
    //   })
    // })
   
    // teamCollection('team')
    //   .where({
    //     _id: XK4VkXkPDdDCJ860
    //   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onChangeShowState: function (event) {
    var that = this;
    // var toggleBtnVal = that.data.uhide;
    // var itemId = event.currenTarget.id;
    // if(toggleBtnVal == itemId){

    // }
    that.setData({
      showView: (!that.data.showView)
    })
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
  catchTheID: function (event) {
    var that = this;
    var Id = event.currentTarget.id;
    var boxid = that.data.uhide;
    console.log('boxid:' + boxid)
    if (boxid == Id) {
      console.log('Id:' + Id);
      taskCollection.where({ _id: Id }).get().then(res => {
        that.setData({
          task: res.data,
          uhide: 0
        })
        console.log(res.data)
      })
    } else {
      that.setData({
        uhide: Id
      })
    }
      
    
  },
  height: function (e) {
    if (showView) {
      var box = e.target.id;
    }
  }
})