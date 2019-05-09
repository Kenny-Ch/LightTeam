Page({

  /**
   * 页面的初始数据
   */
  data: {
    next1: false,
    next2: false,
    next3:false,
    next4:false,
    next5:false
  },
  bind1: function() {
    var that = this;
    that.setData({
      next1: true
    })
     },
  bind2: function() {
    var that = this;
    that.setData({
      next2: true
    })
  },
  bind3:function(){
    var that=this;
    that.setData({
      next3:true
    })
  },
  bind4: function () {
    var that = this;
    that.setData({
      next4: true
    })
  },
  bind5: function () {
    var that = this;
    that.setData({
      next5: true
    })
    console.log(that.data.next5)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})