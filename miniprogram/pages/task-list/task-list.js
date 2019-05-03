// pages/detail-task/detal-task.js
const db = wx.cloud.database()
const _ = db.command
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxStyle: 'box_b',
    up: true,
    down: false,
    teamName: '',
    memberNum: '',
    teamIntroduce: '',
    openId: '',
    teamId: '',
    userId: '',
    taskList: [],
    task: [],
    userList: [],
    uhide: 0,
    currentTab: '',
    taskListLength: 1,
    boxcolor: ["", "#fc2100", "#fff659", "#27e530", "#5a97f6"]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
        for (var i = 0; i < that.data.taskList.length; i++) {
          db.collection('task').where({
            _id: that.data.taskList[i]
          }).get({
            success(res) {
              that.data.task.push(res.data[0])
              that.setData({
                task: that.data.task
              })
            }
          })
        }
        console.log('【task-list】【获取指定的task信息】【获取成功】', that.data.task)
      }
    })

  },
  /*** 滑动切换tab***/
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
    // console.log(e.detail.current)
  },
  /*** 点击tab切换***/
  swichNav: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    })
    // console.log(e.detail.setdata.current)
  },
  bindMemberList: function () {
      wx.redirectTo({
        url: '/pages/number-list/number-list',
      })
  },
  longPressDelete: function(e) {
    var that = this;
    var task = that.data.task;
    var taskList = that.data.taskList;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除此任务吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('【task-list】【长按删除】【点击确定】', '索引为：', index);
          task.splice(index, 1);
          taskList.splice(index, 1);
          db.collection('user').doc('').update({
            data: {
              style: _.remove()
            }
          })
        } else if (res.cancel) {
          console.log('【task-list】【长按删除】【点击取消】');
          return false;
        }
        that.setData({
          task,
          taskList
        });
      }
    })
  },
  onChangeShowState: function(event) {
    var that = this;
    // var toggleBtnVal = that.data.uhide;
    // var itemId = event.currenTarget.id;
    // if(toggleBtnVal == itemId){

    // }
  },
  addTask: function(res) {
    var that = this;
    if (this.data.currentTab) {
        if (res.from === 'button') {
          console.log('【invite】【分享方式】【通过button分享】', res)
        }
        return {
          title: '邀请你加入新团队',
          path: '/pages/beInvited/beInvited?teamId=' + that.data.teamId,
          imageUrl: '/images/share.png',
        }

    } else {
      wx.navigateTo({
        url: '/pages/create_task/create_task?teamId=' + that.data.teamId + '&openId=' + that.data.openId + '&userId=' + that.data.userId + '&teamName=' + that.data.teamName
      })
    }

  },
  bindTaskDetail: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(this.data.task[index]);
    var that = this;
    wx.navigateTo({
      url: '/pages/task/task?taskId=' + that.data.task[index]._id + '&teamName=' + that.data.teamName+'&userId='+that.data.userId
    })
  }
})