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
        teamIntroduce: '',
        openId: '',
        teamId: '',
        userId: '',
        taskList: [],
        task: [],
        userList: [],
        currentTab: '',
        taskListLength: 1,
      },
      /**
       * 生命周期函数--监听页面加载
       */
  onLoad: function (options) {
    console.log('【task-list】【index界面传入参数】', options)
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
          teamIntroduce: res.data[0].introduce,
          taskList: res.data[0].taskList,
          userList: res.data[0].userList,
          taskListLength: res.data[0].taskList.length * 510
        })
        console.log('【task-list】【获取指定的team信息】【获取成功】', res.data[0])
        // for (var i = 0; i < that.data.taskList.length; i++) {
        //   db.collection('task').where({
        //     _id: that.data.taskList[i]
        //   }).get({
        //     success(res) {
        //       that.data.task.push(res.data[0])
        //       that.setData({
        //         task: that.data.task
        //       })
        //     }
        //   })
        // }
        // console.log('【task-list】【获取指定的task信息】【获取成功】', that.data.task)
      }
    })
  },
  })
