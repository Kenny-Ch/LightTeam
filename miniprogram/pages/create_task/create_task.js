// pages/create_task/create_task.js
Page({
   
   /* 页面的初始数据
   */
  data: {
    checkbox:[
      { name:"创建任务后马上提醒大家"},
      { name: "创建任务后马上提醒大家"},
      { name: "创建任务后马上提醒大家"},
      ],
    multiIndex: [0, 0, 0],
    dateBegin: '请选择开始日期',
    dateEnd: '请选择结束日期',
    timeBegin: '请选择开始时间',
    timeEnd:'请选择结束时间',
    index: 1,
    tag: ['','重要且紧急', '不重要且紧急', '重要且不紧急','不重要且不紧急'],
    tagicon:['transparenttag','redtag','','',''],
    tagItem: '全部',
    },
  bindDateBeginChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateBegin: e.detail.value
    })
  },
  bindDateEndChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateEnd: e.detail.value
    })
  },
  bindTimeBeginChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeBegin: e.detail.value
    })
  },
  bindTimeEndChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeEnd: e.detail.value
    })
  },
  bindTagChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
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

  }
})