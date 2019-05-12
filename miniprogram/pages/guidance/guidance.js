Page({

  /**
   * 页面的初始数据
   */
  data: {
    next1: false,
    next2: false,
    next3:false,
    next4:false,
    next5:false,
    next6:false,
    next7:false
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
  },
  bind6: function () {
    var that = this;
    that.setData({
      next6: true
    })
  },
  bind7: function () {
    var that = this;
    that.setData({
      next7: true
    })
    console.log(that.data.next7)
  },
  finish:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})