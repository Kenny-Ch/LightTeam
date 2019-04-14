// pages/number-list/number-list.js
const db = wx.cloud.database()
const nameCollection = db.collection('name')
const teamCollection = db.collection('team')
const _ =db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    teamCollection.get().then(res => {
      this.setData({
        team: res.data
      })

    })
    nameCollection.doc(options.id).field({
      gender:true,
      avatarUrl:true,
      nickName:true
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

  },
  longPress: function (e) {
    var that = this;
    var team = that.data.userList2;
    var index = e.currentTarget.dataset.index;//获取当前名片下标
    wx.showModal({ //使用模态框提示用户进行操作
      title: 'FBI Warning',
      content: '你确认要删除吗？',
      success: function (res) {
        if (res.confirm) { //判断用户是否点击了确定
          // teamCollection.doc(that.data.id).remove({
          //   success(res) {
          //     console.log(that.data.id)
          //   }
          // })
          team.splice(index, 0);
          console.log(res);
        }
        that.setData({
          userList2
        });
      }
    })
  }
})