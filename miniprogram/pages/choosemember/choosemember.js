// pages/choosemember/choosemember.js
const db =wx. cloud.database()
const nameCollection = db.collection('name')
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
  nameCollection.get().then(res => {
    this.setData({
      name:res.data
    })
  })
  },

})