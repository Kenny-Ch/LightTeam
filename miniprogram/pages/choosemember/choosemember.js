// pages/choosemember/choosemember.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({

      /**
       * 页面的初始数据
       */
      data: {
        teamName: '',
        memberNum: '',
        openId: '',
        teamId: '',
        userId: '',
        userList: [],
      },
      /**
       * 生命周期函数--监听页面加载
       */
  onLoad: function (options) {
    console.log('【choosemember】【create_task界面传入参数】', options)
    this.setData({
      teamId: options.teamId,
      openId: options.openId,
      userId: options.userId
    })
    var that = this;
    db.collection('team').where({
      _id: options.teamId
    }).get({
      success(res) {
        that.setData({
          teamName: res.data[0].name,
          memberNum: res.data[0].userNum,
          userList: res.data[0].userList,
        })
        console.log('【chooosemember】【获取指定的team信息】【获取成功】', res.data[0])
      }
    })
  },
  })
